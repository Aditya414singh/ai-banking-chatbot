// import React, { useEffect, useRef, useState } from "react";
// import "./UserChat.css";

// import { useSearchParams } from "react-router-dom";

// const STORAGE_KEY = "astra_chats_v2";

// function uid() {
//   return Math.random().toString(36).slice(2, 9);
// }

// function nowISO() {
//   return new Date().toISOString();
// }

// function formatDateLabel(iso) {
//   const d = new Date(iso);
//   const today = new Date();
//   const isToday =
//     d.getFullYear() === today.getFullYear() &&
//     d.getMonth() === today.getMonth() &&
//     d.getDate() === today.getDate();

//   if (isToday) return "Today";

//   const yesterday = new Date();
//   yesterday.setDate(today.getDate() - 1);

//   if (
//     d.getFullYear() === yesterday.getFullYear() &&
//     d.getMonth() === yesterday.getMonth() &&
//     d.getDate() === yesterday.getDate()
//   )
//     return "Yesterday";

//   return d.toLocaleDateString();
// }

// const initialChatTemplate = (ifsc) => ({
//   id: uid(),
//   title: ifsc ? `Chat - ${ifsc}` : `New chat`,
//   createdAt: nowISO(),
//   messages: [
//     {
//       id: uid(),
//       from: "bot",
//       text: "Hi — I'm Astra, your Smart Bank assistant. How can I help you today?",
//       ts: nowISO(),
//     },
//   ],
// });

// export default function UserChat() {
//   const [params] = useSearchParams();
//   const IFSC = params.get("ifsc") || "N/A";

//   const [chats, setChats] = useState([]);
//   const [currentId, setCurrentId] = useState(null);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [copied, setCopied] = useState(false);

//   // 🔥 VOICE STATES
//   const [isRecording, setIsRecording] = useState(false);
//   const [language, setLanguage] = useState("hi-IN");
//   const [listening, setListening] = useState(false);
//   // For fallback/still-available MediaRecorder code
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   // For SpeechRecognition (Web Speech API)
//   const recognitionRef = useRef(null);

//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);

//   // --------------------------
//   // LOAD CHATS
//   // --------------------------
//   useEffect(() => {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (raw) {
//       const parsed = JSON.parse(raw);
//       setChats(parsed);
//       setCurrentId(parsed[0]?.id);
//     } else {
//       const first = initialChatTemplate(IFSC);
//       setChats([first]);
//       setCurrentId(first.id);
//     }
//   }, [IFSC]);

//   // SAVE CHATS
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
//   }, [chats]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chats, isTyping]);

//   const currentChat = chats.find((c) => c.id === currentId);

//   const updateCurrentChat = (mutate) => {
//     setChats((prev) =>
//       prev.map((c) => (c.id === currentId ? mutate(c) : c))
//     );
//   };

//   const newChat = () => {
//     const c = initialChatTemplate(IFSC);
//     setChats((prev) => [c, ...prev]);
//     setCurrentId(c.id);
//   };

//   const deleteChat = (id) => {
//     const next = chats.filter((c) => c.id !== id);
//     setChats(next);
//     if (next.length) setCurrentId(next[0].id);
//     else {
//       const c = initialChatTemplate(IFSC);
//       setChats([c]);
//       setCurrentId(c.id);
//     }
//   };

//   // --------------------------
//   // SEND MESSAGE
//   // --------------------------
//   const handleSend = () => {
//   if (!input.trim()) return;

//   let userText = input.trim();       // save message
//   setInput("");                        
//     console.log("User input:", userText);  // log input here
//     console.log("input is", input);
//   const userMsg = {
//     id: uid(),
//     from: "user",
//     text: userText,
//     ts: nowISO(),
//   };

//   updateCurrentChat((c) => ({
//     ...c,
//     messages: [...c.messages, userMsg],
//   }));

//   simulateReply(userText);


// };


//   // SIMULATED BOT REPLY
//   // This function now also triggers TTS playback for the bot reply
// //   const simulateReply = (userText) => {
// //   setIsTyping(true);

// //   setTimeout(() => {
// //     const reply = {
// //       id: uid(),
// //       from: "bot",
// //       text: `Astra: "${userText}" for branch ${IFSC}`,
// //       ts: nowISO(),
// //     };

// //     updateCurrentChat((c) => ({
// //       ...c,
// //       messages: [...c.messages, reply],
// //     }));

// //     setIsTyping(false);

// //     // stop any previous speech
// //     window.speechSynthesis.cancel();

// //     // speak new reply
// //     speakText(reply.text);
// //   }, 1000);
// // };


// //   const simulateReply = async (userText) => {
// //   setIsTyping(true);

// //   try {
// //     const res = await fetch("http://localhost:5002/api/google-doc"); // FIXED ROUTE
// //     const data = await res.json();
// //     const replyText = data.text || "No content available in document.";

// //     const reply = {
// //       id: uid(),
// //       from: "bot",
// //       text: replyText,
// //       ts: nowISO(),
// //     };

// //     updateCurrentChat((c) => ({
// //       ...c,
// //       messages: [...c.messages, reply],
// //     }));

// //     speakText(replyText); // bot speaks

// //   } catch (err) {
// //     console.error("DOC API ERROR:", err);

// //     updateCurrentChat((c) => ({
// //       ...c,
// //       messages: [
// //         ...c.messages,
// //         {
// //           id: uid(),
// //           from: "bot",
// //           text: "Error fetching Google Doc content 😞",
// //           ts: nowISO(),
// //         },
// //       ],
// //     }));
// //   }

// //   setIsTyping(false);
// // };
//   const simulateReply = async (userText) => {
//   setIsTyping(true); // start loading shimmer immediately

//   try {
//     // Call bot immediately (no waiting here)
//     const res = await fetch("http://localhost:5002/api/google-doc");
//     const data = await res.json();
//     const replyText = data.text || "No content available in document.";

//     // Wait 8–10 sec before showing reply
//     setTimeout(() => {
//       const reply = {
//         id: uid(),
//         from: "bot",
//         text: replyText,
//         ts: nowISO(),
//       };

//       updateCurrentChat((c) => ({
//         ...c,
//         messages: [...c.messages, reply],
//       }));

//       setIsTyping(false); // hide loading

//       speakText(replyText);  // 🔊 bot speaks

//     }, 1000); // 9 sec delay (change 8000–10000 ms as needed)

//   } catch (err) {
//     console.error("DOC API ERROR:", err);

//     updateCurrentChat((c) => ({
//       ...c,
//       messages: [...c.messages, {
//         id: uid(),
//         from: "bot",
//         text: "Error fetching content ❗",
//         ts: nowISO(),
//       }],
//     }));

//     setIsTyping(false);
//   }
// };

//   // --------------------------
//   // GROUP MESSAGES
//   // --------------------------
//   const groupedMessages = (messages = []) => {
//     let last = null;
//     const out = [];
//     messages.forEach((m) => {
//       const label = formatDateLabel(m.ts);
//       if (label !== last) {
//         out.push({ type: "label", label });
//         last = label;
//       }
//       out.push({ type: "msg", payload: m });
//     });
//     return out;
//   };

//   const copyText = (input) => {
//     navigator.clipboard.writeText(input);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 800);
//   };

//   const openChat = (id) => {
//     setCurrentId(id);
//   };

//   // -----------------------------------------------------------
//   // 🎤 START RECORDING — using Web Speech API (preferred)
//   // -----------------------------------------------------------
//   const startRecognition = () => {
//     // browser compatibility
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       // Browser doesn't support SpeechRecognition -> fallback to media recording + backend STT
//       console.warn("Web Speech API not supported. Falling back to recorded STT.");
//       startRecordingFallback(); // uses MediaRecorder & backend STT
//       return;
//     }

//     // create new instance each time to avoid stale event handlers
//     const recognition = new SpeechRecognition();
//     recognition.lang = language || "hi-IN";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
//     recognition.continuous = false; // one-shot recognition
//     recognition.autoStop = true;  
//     recognition.onstart = () => {
//       setListening(true);
//       setIsRecording(true);
//     };

// //   recognition.onresult = (event) => {
// //   const transcript = Array.from(event.results).map(r => r[0].transcript).join(" ");
  
// //   if (!transcript.trim()) return;
// //   if (transcript.trim() === input.trim()) return; // avoid duplicate input

// //   setInput(transcript);

// //   setTimeout(() => {
// //     handleSend();
// //   }, 200);
// // };
// const handleSend = (msg) => {
//   const userText = (msg ?? input).trim();   // if msg provided use it, else input box text
//   if (!userText) return;

//   setInput("");   // clear field

//   const userMsg = {
//     id: uid(),
//     from: "user",
//     text: userText,
//     ts: nowISO(),
//   };

//   updateCurrentChat((c) => ({
//     ...c,
//     messages: [...c.messages, userMsg],
//   }));

//   simulateReply(userText);
// };




//     recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       // if no-speech or not-allowed, end gracefully
//       setListening(false);
//       setIsRecording(false);
//       // optionally notify user
//       if (event.error === "not-allowed" || event.error === "service-not-allowed") {
//         alert("Microphone access denied. Please allow microphone permission and try again.");
//       }
//     };

//     recognition.onend = () => {
//       // recognition ended (either completed or aborted)
//       setListening(false);
//       setIsRecording(false);
//     };

//     recognitionRef.current = recognition;
//     try {
//       recognition.start();
//     } catch (err) {
//       console.error("Failed to start recognition", err);
//       setListening(false);
//       setIsRecording(false);
//     }
//   };

//   // Fallback: Record audio, send to /stt backend (keeps your original behavior if Web Speech API unavailable)
//   const startRecordingFallback = async () => {
//     setListening(true);

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);

//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         audioChunksRef.current.push(e.data);
//       };

//       mediaRecorder.onstop = async () => {
//         setListening(false);

//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: "audio/wav",
//         });

//         const formData = new FormData();
//         formData.append("file", audioBlob);
//         formData.append("lang", language);

//         // ---- NLP BACKEND STT endpoint expected at localhost:5001/stt ----
//         try {
//           const res = await fetch("http://localhost:5001/stt", {
//             method: "POST",
//             body: formData,
//           });

//           const data = await res.json();

//           if (data.text) {
//             setInput(data.text);
//             setTimeout(() => handleSend(), 150);
//           } else {
//             alert("Could not transcribe audio.");
//           }
//         } catch (err) {
//           console.error("STT fallback error:", err);
//           alert("STT service unavailable.");
//         }
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (err) {
//       alert("Microphone access denied or not available.");
//       setListening(false);
//       setIsRecording(false);
//     }
//   };

//   // STOP recognition or recorder
//   const stopRecognition = () => {
//     // stop Web Speech API if running
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop();
//       } catch (err) {
//         // ignore
//       }
//       recognitionRef.current = null;
//     }

//     // stop media recorder fallback if running
//     const recorder = mediaRecorderRef.current;
//     if (recorder && recorder.state !== "inactive") {
//       recorder.stop();
//       mediaRecorderRef.current = null;
//     }

//     setIsRecording(false);
//     setListening(false);
//   };

//   const toggleRecording = () => {
//     if (isRecording) stopRecognition();
//     else startRecognition();
//   };

//   // -----------------------------------------------------------
//   // 🔊 TTS (Speak response) — uses backend TTS if available,
//   // otherwise falls back to browser speechSynthesis
//   // -----------------------------------------------------------
// //   const speakText = async (text) => {
// //   try {
// //     // 1️⃣ Browser SpeechSynthesis first (instant)
// //     const utter = new SpeechSynthesisUtterance(text);
// //     utter.lang = language || "en-IN";
// //     window.speechSynthesis.speak(utter);
// //     return; // <-- return here so backend won't be called

// //   } catch (e) {
// //     console.log("Browser TTS failed, fallback to backend...");
// //   }

// //   // 2️⃣ Backend fallback (slow but better voice)
// //   try {
// //     const res = await fetch(
// //       `http://localhost:5001/tts?text=${encodeURIComponent(text)}&lang=${language}`
// //     );
// //     const blob = await res.blob();
// //     const url = URL.createObjectURL(blob);
// //     new Audio(url).play();
// //   } catch (err) {
// //     console.error("TTS failed:", err);
// //   }
// // };
// //   const speakText = async (text) => {
// //   try {
// //     // 1️⃣ Instant Browser Text-to-Speech
// //     const utter = new SpeechSynthesisUtterance(text);
// //     utter.lang = language || "en-IN";

// //     // STOP listening while bot is speaking
// //     stopRecognition();

// //     // 🔥 When bot finishes speaking → start listening automatically
// //     utter.onend = () => {
// //       console.log("Bot finished speaking. Restarting mic...");
// //       startRecognition(); // <--- CONTINUOUS VOICE MODE ENABLED
// //     };

// //     window.speechSynthesis.cancel(); // prevent overlapping voices
// //     window.speechSynthesis.speak(utter);
// //     return;

// //   } catch (e) {
// //     console.log("Browser TTS failed, fallback to backend...");
// //   }

// //   // 2️⃣ Backend TTS fallback (if needed)
// //   try {
// //     const res = await fetch(
// //       `http://localhost:5001/tts?text=${encodeURIComponent(text)}&lang=${language}`
// //     );
// //     const blob = await res.blob();
// //     const url = URL.createObjectURL(blob);
// //     const audio = new Audio(url);

// //     stopRecognition();
// //     audio.play();

// //     // Auto-listen after backend audio plays
// //     audio.onended = () => startRecognition();

// //   } catch (err) {
// //     console.error("TTS fallback failed:", err);
// //     startRecognition(); // prevent stuck state
// //   }
// // };
//   const speakText = (text) => {
//   stopRecognition();  // stop listening during speech

//   const utter = new SpeechSynthesisUtterance(text);
//   utter.lang = language || "en-IN";

//   utter.onend = () => {
//     console.log("Bot finished speaking → resume mic after short delay...");
//     setTimeout(() => startRecognition(), 1500);  // 🔥 small gap avoids repeated input
//   };

//   window.speechSynthesis.cancel();
//   window.speechSynthesis.speak(utter);
// };



//   return (
//     <div className="chat-layout">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <button className="new-chat-btn" onClick={newChat}>
//           ➕ New Chat
//         </button>

//         <div className="sidebar-chats">
//           {chats.map((c) => (
//             <div
//               key={c.id}
//               className={`sidebar-item ${c.id === currentId ? "active" : ""}`}
//               onClick={() => openChat(c.id)}
//             >
//               <div className="sidebar-info">
//                 <div className="sidebar-title">{c.title}</div>
//                 <div className="sidebar-time">
//                   {new Date(c.createdAt).toLocaleString()}
//                 </div>
//               </div>

//               <div className="sidebar-actions">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     const lastBot = [...c.messages]
//                       .reverse()
//                       .find((m) => m.from === "bot");
//                     copyText(lastBot ? lastBot.text : c.title);
//                   }}
//                 >
//                   ⧉
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (window.confirm("Delete this chat?")) deleteChat(c.id);
//                   }}
//                 >
//                   🗑
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </aside>

//       {/* MAIN CHAT */}
//       <main className="chat-main">
//         <header className="chat-header">
//           <h2>{currentChat?.title || "Astra"}</h2>
//           <span className="ifsc-text">Branch: {IFSC}</span>
//         </header>

//         <div className="chat-messages">
//           {/* MESSAGES */}
//           {currentChat &&
//             groupedMessages(currentChat.messages).map((block, i) => {
//               if (block.type === "label") {
//                 return (
//                   <div key={"lbl-" + i} className="date-label">
//                     {block.label}
//                   </div>
//                 );
//               }

//               const m = block.payload;

//               return (
//                 <div
//                   key={m.id}
//                   className={`msg-row ${m.from === "user" ? "right" : "left"}`}
//                 >
//                   <div className={`msg-bubble ${m.from}`}>
//                     <p>{m.text}</p>

//                     {/* 🔊 SPEAKER BUTTON */}
//                     {m.from === "bot" && (
//                       <button className="speak-btn" onClick={() => speakText(m.text)}>
//                         🔊
//                       </button>
//                     )}

//                     <div className="bubble-meta">
//                       <span className="time">
//                         {new Date(m.ts).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                       <button onClick={() => copyText(m.text)}>⧉</button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//           {/* Typing shimmer */}
//           {isTyping && (
//             <div className="msg-row left">
//               <div className="typing-bubble">
//                 <div className="shimmer short"></div>
//                 <div className="shimmer medium"></div>
//                 <div className="shimmer long"></div>
//               </div>
//             </div>
//           )}

//           {/* 🔥 LISTENING WAVEFORM */}
//           {listening && (
//             <div className="listening-bar">
//               <div className="wave"></div>
//               <div className="wave"></div>
//               <div className="wave"></div>
//               <span>Listening...</span>
//             </div>
//           )}

//           <div ref={messagesEndRef}></div>
//         </div>

//         {/* INPUT BAR */}
//         <div className="chat-input-box">
//           <select
//             className="lang-select"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option value="hi-IN">Hindi 🇮🇳</option>
//             <option value="mr-IN">Marathi</option>
//             <option value="bn-IN">Bengali</option>
//             <option value="ta-IN">Tamil</option>
//             <option value="gu-IN">Gujarati</option>
//             <option value="en-IN">English</option>
//           </select>

//           <button
//             className={`mic-btn ${isRecording ? "active" : ""}`}
//             onClick={toggleRecording}
//             title={isRecording ? "Stop listening" : "Start listening"}
//           >
//             🎤
//           </button>

//           <textarea
//             ref={textareaRef}
//             placeholder="Ask Astra anything..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSend();
//               }
//             }}
//           ></textarea>

//           <button className="send-btn" onClick={handleSend}>
//             ➤
//           </button>
//         </div>
//       </main>

//       {copied && <div className="copy-toast">Copied!</div>}
//     </div>
//   );
// }






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

  // VOICE STATES
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("hi-IN");
  const [listening, setListening] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isTyping]);

  const currentChat = chats.find((c) => c.id === currentId);

  const updateCurrentChat = (mutate) => {
    setChats((prev) => prev.map((c) => (c.id === currentId ? mutate(c) : c)));
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

  // ---------------- SEND MESSAGE ----------------
  const handleSend = (msg) => {
    const userText = (msg ?? input).trim();
    if (!userText) return;

    setInput("");

    const userMsg = {
      id: uid(),
      from: "user",
      text: userText,
      ts: nowISO(),
    };

    updateCurrentChat((c) => ({
      ...c,
      messages: [...c.messages, userMsg],
    }));

    simulateReply(userText);
  };

  // ---------------- BOT REPLY ----------------
  const simulateReply = async (userText) => {
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5002/api/google-doc");
      const data = await res.json();
      const replyText = data.text || "No content available in document.";

      setTimeout(() => {
        const reply = {
          id: uid(),
          from: "bot",
          text: replyText,
          ts: nowISO(),
        };

        updateCurrentChat((c) => ({
          ...c,
          messages: [...c.messages, reply],
        }));

        setIsTyping(false);

        speakText(replyText); // bot speaks

      }, 1000);

    } catch (err) {
      console.error("DOC API ERROR:", err);

      updateCurrentChat((c) => ({
        ...c,
        messages: [...c.messages,
          { id: uid(), from: "bot", text: "Error fetching content ❗", ts: nowISO() }
        ],
      }));

      setIsTyping(false);
    }
  };

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

  const openChat = (id) => setCurrentId(id);

  // ---------------- SPEECH RECOGNITION ----------------
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return startRecordingFallback();

    const recognition = new SpeechRecognition();
    recognition.lang = language || "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join(" ");
      if (transcript.trim()) handleSend(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setListening(false);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const startRecordingFallback = async () => {
    setListening(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      mediaRecorder.onstop = async () => {
        setListening(false);

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioBlob);
        formData.append("lang", language);

        try {
          const res = await fetch("http://localhost:5001/stt", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (data.text) handleSend(data.text);

        } catch {
          alert("STT service unavailable.");
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch {
      alert("Microphone access denied or unavailable.");
      setListening(false);
      setIsRecording(false);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();

    setIsRecording(false);
    setListening(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecognition();
    else startRecognition();
  };

  // ---------------- TTS (Mic will NOT auto restart) ----------------
  const speakText = (text) => {
    stopRecognition(); // mic stays OFF

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language || "en-IN";

    utter.onend = () => {
      console.log("Speech finished → mic NOT restarting");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // =====================================================================
  return (
    <div className="chat-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={newChat}>➕ New Chat</button>

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
                    const lastBot = [...c.messages].reverse().find((m) => m.from === "bot");
                    copyText(lastBot ? lastBot.text : c.title);
                  }}
                >⧉</button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Delete this chat?")) deleteChat(c.id);
                  }}
                >🗑</button>
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
          {currentChat &&
            groupedMessages(currentChat.messages).map((block, i) => {
              if (block.type === "label")
                return <div key={"lbl-" + i} className="date-label">{block.label}</div>;

              const m = block.payload;

              return (
                <div key={m.id} className={`msg-row ${m.from === "user" ? "right" : "left"}`}>
                  <div className={`msg-bubble ${m.from}`}>
                    <p>{m.text}</p>

                    {m.from === "bot" && (
                      <button className="speak-btn" onClick={() => speakText(m.text)}>🔊</button>
                    )}

                    <div className="bubble-meta">
                      <span className="time">
                        {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button onClick={() => copyText(m.text)}>⧉</button>
                    </div>
                  </div>
                </div>
              );
            })}

          {isTyping && (
            <div className="msg-row left">
              <div className="typing-bubble">
                <div className="shimmer short"></div>
                <div className="shimmer medium"></div>
                <div className="shimmer long"></div>
              </div>
            </div>
          )}

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
            title={isRecording ? "Stop listening" : "Start listening"}
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

          <button className="send-btn" onClick={handleSend}>➤</button>
        </div>
      </main>

      {copied && <div className="copy-toast">Copied!</div>}
    </div>
  );
}
