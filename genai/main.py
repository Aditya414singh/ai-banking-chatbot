# try_rag_suraksha.py
# Python 3.9+
# End-to-end RAG that avoids mid-sentence truncation and gives complete answers.

import os
import re
import argparse
import pickle
from typing import List, Dict, Tuple

# ---- LangChain (0.2+) imports ----
from langchain_community.document_loaders import UnstructuredURLLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFacePipeline
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

# ---- Transformers (for local LLM via HF) ----
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# --------------- CONFIG ---------------

# Embedding model (fast, small, CPU friendly)
EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# A small local seq2seq model for generation (change to a larger one if you have GPU)
LLM_MODEL_NAME = "google/flan-t5-base"

# Vector store file paths
FAISS_FILE = "faiss_index.pkl"
CHUNK_CACHE = "chunks.pkl"   # stores original contiguous chunks for stitching

# Chunking config – tuned to reduce truncation issues
CHUNK_SIZE = 1200
CHUNK_OVERLAP = 150

# --------------------------------------


def load_documents_from_url(url: str) -> List[Document]:
    """Load a public Google Doc (or any web page) as text documents."""
    loader = UnstructuredURLLoader(urls=[url])
    docs = loader.load()
    # Normalize whitespace
    for d in docs:
        d.page_content = re.sub(r"[ \t]+", " ", d.page_content).strip()
    return docs


def chunk_documents(docs: List[Document]) -> List[Document]:
    """Split documents with overlap and attach chunk indices so we can stitch later."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ".", " ", ""],
    )
    split_docs = []
    for d in docs:
        parts = splitter.split_text(d.page_content)
        for i, txt in enumerate(parts):
            # Attach source + chunk_id for later stitching
            meta = dict(d.metadata) if d.metadata else {}
            meta["source"] = meta.get("source", "web")
            meta["chunk_id"] = i
            split_docs.append(Document(page_content=txt, metadata=meta))
    return split_docs


def build_vector_store(chunks: List[Document]) -> FAISS:
    """Create a FAISS vector index from chunks."""
    embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL_NAME)
    vs = FAISS.from_documents(chunks, embeddings)
    return vs


def save_vector_store(vs: FAISS, path: str) -> None:
    with open(path, "wb") as f:
        pickle.dump(vs, f)


def load_vector_store(path: str) -> FAISS:
    with open(path, "rb") as f:
        return pickle.load(f)


def cache_chunks(chunks: List[Document], path: str) -> Dict[Tuple[str, int], str]:
    """Save a mapping of (source, chunk_id) -> text so we can stitch partial sentences."""
    cache = {}
    for c in chunks:
        src = c.metadata.get("source", "web")
        idx = c.metadata.get("chunk_id", -1)
        cache[(src, idx)] = c.page_content
    with open(path, "wb") as f:
        pickle.dump(cache, f)
    return cache


def load_chunk_cache(path: str) -> Dict[Tuple[str, int], str]:
    with open(path, "rb") as f:
        return pickle.load(f)


def looks_cut_off(text: str) -> bool:
    """Heuristic: if it doesn't end with sentence punctuation, likely cut."""
    text = text.rstrip()
    return not re.search(r"[.?!…]$", text)


def stitch_docs_if_needed(
    retrieved: List[Document],
    chunk_cache: Dict[Tuple[str, int], str],
    max_follow_chunks: int = 2,
) -> List[Document]:
    """
    If a retrieved chunk ends mid-sentence, try appending the next 1–2 chunks
    from the same source to complete the sentence.
    """
    stitched = []
    for d in retrieved:
        src = d.metadata.get("source", "web")
        cid = d.metadata.get("chunk_id", -1)

        buf = [d.page_content]
        follow = 0

        # Append next chunks from the same source if we think it's cut
        while looks_cut_off(buf[-1]) and follow < max_follow_chunks:
            nxt_key = (src, cid + 1 + follow)
            nxt_txt = chunk_cache.get(nxt_key)
            if not nxt_txt:
                break
            buf.append(nxt_txt)
            follow += 1

        merged = "\n".join(buf)
        stitched.append(Document(page_content=merged, metadata=d.metadata))
    return stitched


def build_local_llm() -> HuggingFacePipeline:
    """HuggingFace text-generation (seq2seq) pipeline wrapped for LangChain."""
    tokenizer = AutoTokenizer.from_pretrained(LLM_MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(LLM_MODEL_NAME)
    gen = pipeline(
        task="text2text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=512,
        temperature=0.2,
    )
    return HuggingFacePipeline(pipeline=gen)


def make_qa_chain(vs: FAISS) -> RetrievalQA:
    """Create a RetrievalQA chain with instructions to produce complete sentences."""
    llm = build_local_llm()

    prompt_tmpl = PromptTemplate(
        input_variables=["context", "question"],
        template=(
            "You are a meticulous banking assistant. Using ONLY the provided context, "
            "answer the question in complete, well-formed sentences. If a thought is cut mid-sentence "
            "in one passage, assume its continuation may appear in other passages and integrate them. "
            "If the answer is not present, say you don't know.\n\n"
            "Context:\n{context}\n\n"
            "Question: {question}\n\n"
            "Answer:"
        ),
    )

    retriever = vs.as_retriever(search_type="similarity", k=5)
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",  # simplest; we’re ensuring complete context ourselves
        retriever=retriever,
        chain_type_kwargs={"prompt": prompt_tmpl},
        return_source_documents=True,
    )
    return qa


def run_query(
    query: str,
    vs: FAISS,
    chunk_cache: Dict[Tuple[str, int], str],
) -> Dict:
    """Retrieve with k>1, stitch partial chunks, then run QA."""
    # Pull the raw top-k documents
    retriever = vs.as_retriever(search_type="similarity", k=5)
    raw_docs: List[Document] = retriever.get_relevant_documents(query)

    # Stitch any mid-sentence truncations
    stitched_docs = stitch_docs_if_needed(raw_docs, chunk_cache)

    # Temporarily run a one-off QA with our own stitched context
    # (We’ll bypass default chain stuffing so we control the exact docs used.)
    llm = build_local_llm()
    prompt_tmpl = PromptTemplate(
        input_variables=["context", "question"],
        template=(
            "You are a meticulous banking assistant. Using ONLY the provided context, "
            "answer the question in complete, well-formed sentences. If a thought is cut mid-sentence "
            "in one passage, assume its continuation may appear in other passages and integrate them. "
            "If the answer is not present, say you don't know.\n\n"
            "Context:\n{context}\n\n"
            "Question: {question}\n\n"
            "Answer:"
        ),
    )

    context = "\n\n---\n\n".join(d.page_content for d in stitched_docs)
    final_prompt = prompt_tmpl.format(context=context, question=query)
    answer = llm.invoke(final_prompt)

    return {
        "answer": answer,
        "sources": stitched_docs,
    }


def ensure_index(gdoc_url: str) -> Tuple[FAISS, Dict[Tuple[str, int], str]]:
    """
    Build or load FAISS + chunk cache for the given doc URL.
    If the index exists, we load it; otherwise we create it.
    """
    if os.path.exists(FAISS_FILE) and os.path.exists(CHUNK_CACHE):
        vs = load_vector_store(FAISS_FILE)
        cache = load_chunk_cache(CHUNK_CACHE)
        return vs, cache

    # Build pipeline
    docs = load_documents_from_url(gdoc_url)
    chunks = chunk_documents(docs)
    cache = cache_chunks(chunks, CHUNK_CACHE)
    vs = build_vector_store(chunks)
    save_vector_store(vs, FAISS_FILE)
    return vs, cache


def main():
    parser = argparse.ArgumentParser(description="RAG for Suraksha Bank docs (complete-sentence answers).")
    parser.add_argument("--gdoc", type=str, required=True, help="Public Google Doc (or web) URL.")
    parser.add_argument("--query", type=str, required=True, help="Your question.")
    parser.add_argument("--rebuild", action="store_true", help="Force rebuild the vector store.")
    args = parser.parse_args()

    if args.rebuild:
        # Force rebuild by deleting existing files
        if os.path.exists(FAISS_FILE):
            os.remove(FAISS_FILE)
        if os.path.exists(CHUNK_CACHE):
            os.remove(CHUNK_CACHE)

    vs, cache = ensure_index(args.gdoc)
    result = run_query(args.query, vs, cache)

    print("\n=== ANSWER ===")
    # result["answer"] is a dict or string depending on pipeline; normalize:
    ans = result["answer"]
    if isinstance(ans, dict) and "generated_text" in ans:
        print(ans["generated_text"].strip())
    else:
        print(str(ans).strip())

    print("\n=== TOP CONTEXT SNIPPETS (stitched) ===")
    for i, d in enumerate(result["sources"], 1):
        src = d.metadata.get("source", "web")
        cid = d.metadata.get("chunk_id", -1)
        preview = d.page_content[:300].replace("\n", " ")
        print(f"[{i}] source={src} chunk_id={cid} :: {preview}...")


if __name__ == "__main__":
    main()
