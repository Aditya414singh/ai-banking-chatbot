import React, { useEffect, useMemo, useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const phrases = useMemo(() => ["Ask.", "Talk.", "Bank Smarter."], []);

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "Smart Bank – AI Banking Chatbot";
  }, []);

  // typewriter effect
  useEffect(() => {
    const currentPhrase = phrases[index];
    if (!deleting && subIndex === currentPhrase.length) {
      setTimeout(() => setDeleting(true), 1000);
      return;
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? 60 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, phrases]);

  return (
    <div className="homepage">
      <header className="hero">
        <div className="hero-content fade-in">
          <div className="hero-text">
            <h1>Smart Bank 💬</h1>
            <p className="typewriter">
              AI Banking Chatbot —{" "}
              <span className="type-text">{phrases[index].substring(0, subIndex)}</span>
              <span className="cursor"></span>
            </p>

            <div className="buttons">
              <Link to="/user">
                <button className="btn btn-primary">💬 Try Chatbot</button>
              </Link>
              <Link to="/admin/login">
                <button className="btn btn-secondary">👨‍💼 Admin Login</button>
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img src="/assets/chatbot.png" alt="AI Chatbot" />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features fade-in">
        <h2>🚀 Key Features</h2>
        <div className="feature-grid">
          <div className="card">
            <h3>🔐 Secure Admin Portal</h3>
            <p>Upload banking documents and manage branch details securely.</p>
          </div>

          <div className="card">
            <h3>🤖 AI-Powered Chatbot</h3>
            <p>Ask questions and get instant document-based answers.</p>
          </div>

          <div className="card">
            <h3>🗣️ Voice Assistant</h3>
            <p>Talk naturally with multilingual speech recognition and synthesis.</p>
          </div>

          <div className="card">
            <h3>📊 Smart Dashboard</h3>
            <p>Monitor and manage your system through a modern, intuitive dashboard.</p>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="modules fade-in">
        <h2>🧩 System Modules</h2>
        <p className="modules-subtitle">
          Smart Bank is powered by four interconnected modules that work together to deliver an intelligent banking experience.
        </p>

        <div className="modules-grid">
          <div className="module-card">
            <img src="/assets/frontend.png" alt="Frontend Icon" />
            <h3>Frontend</h3>
            <p>React-based UI for users and admins, offering an elegant experience.</p>
          </div>

          <div className="module-card">
            <img src="/assets/backend.png" alt="Backend Icon" />
            <h3>Backend</h3>
            <p>Node.js + Express APIs for data management, authentication, and logic.</p>
          </div>

          <div className="module-card">
            <img src="/assets/genAi.png" alt="Gen AI Icon" />
            <h3>Gen AI</h3>
            <p>LLM integration for document-based answering and multilingual support.</p>
          </div>

          <div className="module-card">
            <img src="/assets/nlp.png" alt="NLP Icon" />
            <h3>NLP</h3>
            <p>Voice recognition and text-to-speech for real-time human-like chat.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Smart Bank – AI Banking Chatbot | Team 318</p>
      </footer>
    </div>
  );
};

export default HomePage;
