import React, { useEffect, useRef, useState } from "react";
import "./UserChat.css";
import { useSearchParams } from "react-router-dom";

const STORAGE_KEY = "astra_chats_v2";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function nowISO() {
  return new Date().toISOString();
}

function formatDateLabel(iso) {
  const d = new Date(iso);
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  if (isToday) return "Today";

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  )
    return "Yesterday";

  return d.toLocaleDateString();
}

const initialChatTemplate = (ifsc) => ({
  id: uid(),
  title: ifsc ? `Chat - ${ifsc}` : `New chat`,
  createdAt: nowISO(),
  messages: [
    {
      id: uid(),
      from: "bot",
      text: "Hi — I'm Astra, your Smart Bank assistant. How can I help you today?",
      ts: nowISO(),
    },
  ],
});

export default function UserChat() {
  const [params] = useSearchParams();
  const IFSC = params.get("ifsc") || "N/A";

  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔥 VOICE STATES
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("hi-IN");
  const [listening, setListening] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // --------------------------
  // LOAD CHATS
  // --------------------------
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setChats(parsed);
      setCurrentId(parsed[0]?.id);
    } else {
      const first = initialChatTemplate(IFSC);
      setChats([first]);
      setCurrentId(first.id);
    }
  }, [IFSC]);

  // SAVE CHATS
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isTyping]);

  const currentChat = chats.find((c) => c.id === currentId);

  const updateCurrentChat = (mutate) => {
    setChats((prev) =>
      prev.map((c) => (c.id === currentId ? mutate(c) : c))
    );
  };

  const newChat = () => {
    const c = initialChatTemplate(IFSC);
    setChats((prev) => [c, ...prev]);
    setCurrentId(c.id);
  };

  const deleteChat = (id) => {
    const next = chats.filter((c) => c.id !== id);
    setChats(next);
    if (next.length) setCurrentId(next[0].id);
    else {
      const c = initialChatTemplate(IFSC);
      setChats([c]);
      setCurrentId(c.id);
    }
  };

  // --------------------------
  // SEND MESSAGE
  // --------------------------
  const handleSend = async () => {
    const textToSend = input.trim();
    if (!textToSend) return;

    // 1️⃣ Add USER message (QUESTION) → RIGHT
    const userMsg = {
      id: uid(),
      from: "user",
      text: textToSend,
      ts: nowISO(),
    };

    updateCurrentChat((c) => ({
      ...c,
      messages: [...c.messages, userMsg],
    }));

    setInput("");
    setIsTyping(true);
    setTimeout(async() => {
    try {
      // 2️⃣ Call backend to get response
      const res = await fetch("http://localhost:5002/api/google-doc");
      console.log("Fetching from backend:", res);
      const data = await res.json();

      const botText =
        data.text || "Sorry, I couldn't fetch the document information.";

      // 3️⃣ Add BOT message (RESPONSE) → LEFT
      const botMsg = {
        id: uid(),
        from: "bot",
        text: botText,
        ts: nowISO(),
      };

      updateCurrentChat((c) => ({
        ...c,
        messages: [...c.messages, botMsg],
      }));
    } catch (error) {
      console.error("Error fetching Google Doc text:", error);

      const errorMsg = {
        id: uid(),
        from: "bot",
        text:
          "Oops, something went wrong while fetching the Google Doc. Please try again.",
        ts: nowISO(),
      };

      updateCurrentChat((c) => ({
        ...c,
        messages: [...c.messages, errorMsg],
      }));
    } finally {
      setIsTyping(false);
    }
    }, 10000);
  };

  // --------------------------
  // GROUP MESSAGES BY DATE
  // --------------------------
  const groupedMessages = (messages = []) => {
    let last = null;
    const out = [];
    messages.forEach((m) => {
      const label = formatDateLabel(m.ts);
      if (label !== last) {
        out.push({ type: "label", label });
        last = label;
      }
      out.push({ type: "msg", payload: m });
    });
    return out;
  };

  const copyText = (input) => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };

  const openChat = (id) => {
    setCurrentId(id);
  };

  // -----------------------------------------------------------
  // 🎤 START RECORDING
  // -----------------------------------------------------------
  const startRecording = async () => {
    setListening(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setListening(false);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const formData = new FormData();
        formData.append("file", audioBlob);
        formData.append("lang", language);

        // ---- STT BACKEND ----
        const res = await fetch("http://localhost:5001/stt", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.text) {
          setInput(data.text);
          setTimeout(() => handleSend(), 200);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or not available.");
      setListening(false);
    }
  };

  // STOP RECORDING
  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder) recorder.stop();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  // -----------------------------------------------------------
  // 🔊 TTS (Speak response)
  // -----------------------------------------------------------
  const speakText = async (text) => {
    const res = await fetch(
      `http://localhost:5001/tts?text=${encodeURIComponent(text)}&lang=${language}`
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    new Audio(url).play();
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={newChat}>
          ➕ New Chat
        </button>

        <div className="sidebar-chats">
          {chats.map((c) => (
            <div
              key={c.id}
              className={`sidebar-item ${c.id === currentId ? "active" : ""}`}
              onClick={() => openChat(c.id)}
            >
              <div className="sidebar-info">
                <div className="sidebar-title">{c.title}</div>
                <div className="sidebar-time">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="sidebar-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const lastBot = [...c.messages]
                      .reverse()
                      .find((m) => m.from === "bot");
                    copyText(lastBot ? lastBot.text : c.title);
                  }}
                >
                  ⧉
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Delete this chat?")) deleteChat(c.id);
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CHAT */}
      <main className="chat-main">
        <header className="chat-header">
          <h2>{currentChat?.title || "Astra"}</h2>
          <span className="ifsc-text">Branch: {IFSC}</span>
        </header>

        <div className="chat-messages">
          {/* MESSAGES */}
          {currentChat &&
            groupedMessages(currentChat.messages).map((block, i) => {
              if (block.type === "label") {
                return (
                  <div key={"lbl-" + i} className="date-label">
                    {block.label}
                  </div>
                );
              }

              const m = block.payload;

              return (
                <div
                  key={m.id}
                  className={`msg-row ${
                    m.from === "user" ? "right" : "left"
                  }`}
                >
                  <div className={`msg-bubble ${m.from}`}>
                    <p>{m.text}</p>

                    {/* 🔊 SPEAKER BUTTON */}
                    {m.from === "bot" && (
                      <button
                        className="speak-btn"
                        onClick={() => speakText(m.text)}
                      >
                        🔊
                      </button>
                    )}

                    <div className="bubble-meta">
                      <span className="time">
                        {new Date(m.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button onClick={() => copyText(m.text)}>⧉</button>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Typing shimmer (BOT → LEFT) */}
          {isTyping && (
            <div className="msg-row left">
              <div className="typing-bubble">
                <div className="shimmer short"></div>
                <div className="shimmer medium"></div>
                <div className="shimmer long"></div>
              </div>
            </div>
          )}

          {/* 🔥 LISTENING WAVEFORM */}
          {listening && (
            <div className="listening-bar">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <span>Listening...</span>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT BAR */}
        <div className="chat-input-box">
          <select
            className="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="hi-IN">Hindi 🇮🇳</option>
            <option value="mr-IN">Marathi</option>
            <option value="bn-IN">Bengali</option>
            <option value="ta-IN">Tamil</option>
            <option value="gu-IN">Gujarati</option>
            <option value="en-IN">English</option>
          </select>

          <button
            className={`mic-btn ${isRecording ? "active" : ""}`}
            onClick={toggleRecording}
          >
            🎤
          </button>

          <textarea
            ref={textareaRef}
            placeholder="Ask Astra anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          ></textarea>

          <button className="send-btn" onClick={handleSend}>
            ➤
          </button>
        </div>
      </main>

      {copied && <div className="copy-toast">Copied!</div>}
    </div>
  );
}
