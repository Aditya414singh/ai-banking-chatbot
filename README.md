# 🧠 SmartBank- AI Banking Chatbot

An **AI-powered multilingual banking assistant** that combines intelligent document understanding, voice-based interaction, and smart automation to enhance user experience in modern banking systems.

This project follows a **modular architecture**, consisting of separate components for Frontend, Backend, Gen AI, and NLP, allowing independent development and seamless integration.

---

## 🏗️ Project Overview

The **AI Banking Chatbot System** enables users to:
- Interact with banking information in real time.
- Retrieve details from uploaded documents (e.g., branch data, FAQs, banking guidelines).
- Communicate via both text and voice using natural language processing.
- Access multilingual support powered by LLMs and AI-driven assistants.
- Provide admins with an interface to upload Google Docs and manage branch data.

---

## ✨ Key Features

### 🧑‍💼 Admin Portal
- Secure admin login authentication.
- Upload Google Doc URLs as a knowledge base.
- Add and manage branch details (name, IFSC, address, etc.).
- Simple dashboard UI built with ReactJS and CSS.

### 💬 User Chatbot
- Real-time chat interface similar to ChatGPT layout.
- Supports both text and voice interactions.
- Fetches accurate responses from uploaded documents.
- Fallback to helpdesk email if the query is not found.

### 🤖 Gen AI Module
- Processes and understands content from Google Docs.
- Uses vector embeddings for document-based question answering.
- Supports multilingual responses.
- Integrates with LLMs (LangChain, Gemini, or OpenAI APIs).

### 🗣️ NLP Module
- Voice assistant for speech-to-text and text-to-speech conversion.
- Multilingual input and output.
- Smooth integration with chatbot interface.

---

## 📁 Folder Structure

```bash
ai-banking-chatbot/
│
├── frontend/   → ReactJS-based user interface and admin dashboard
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/    → Node.js + Express-based APIs, authentication, and database management
│   └── README.md
│
├── genai/      → LLM integration and vector database generation for document answering
│   └── README.md
│
├── nlp/        → Voice assistant and multilingual processing (speech-to-text / text-to-speech)
│   └── README.md
│
└── README.md   → Main project overview and documentation
```

---

## ⚙️ Setup Instructions

### 🔹 Clone the Repository
```bash
git clone https://github.com/Aditya414singh/ai-banking-chatbot.git
cd ai-banking-chatbot
```
```bash
cd frontend
npm install
npm start
```
## System Architecture
```bash
                ┌──────────────────────┐
                │        Admin         │
                │ Upload Docs & Branch │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │      Backend API     │
                │ Node.js + Express    │
                └─────────┬────────────┘
                          │
         ┌────────────────┼──────────────────┐
         ▼                ▼                  ▼
 ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
 │   Gen AI    │   │     NLP      │   │   Database    │
 │ Vector DB + │   │ Voice Assist │   │ (Mongo + Vec) │
 │ LLM Answer  │   │ Multi-lang   │   │   Storage     │
 └─────────────┘   └──────────────┘   └──────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │       Frontend       │
                │  React Chatbot UI    │
                └──────────────────────┘
```
## 🚀 Tech Stack

| Module              | Technologies                                         |
| ------------------- | ---------------------------------------------------- |
| **Frontend**        | ReactJS, Plain CSS                                   |
| **Backend**         | Node.js, Express.js, MongoDB                         |
| **Gen AI**          | LangChain, OpenAI API / Gemini API, Pinecone / FAISS |
| **NLP**             | Speech Recognition, TTS, Google Cloud APIs           |
| **Database**        | MongoDB / Vector DB (depending on module)            |
| **Version Control** | Git + GitHub                                         |

## 🎯 Goals

- Build a **secure, multilingual, document-aware chatbot** for banking.  
- Enable **document-based question answering** using LLM + vector databases.  
- Support **text and voice interactions** with natural language understanding.  
- Provide a **modern, intuitive admin dashboard** for content management.  



