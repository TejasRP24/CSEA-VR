import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ChatMessage from "./ChatMessage";
import { sampleMessages, quickReplies } from "./chatbotData";

export default function ChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState(sampleMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, messages]);

  const handleSend = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      type: "user",
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Call the backend API
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    fetch(`${apiUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed }),
    })
      .then((res) => res.json())
      .then((data) => {
        const botMsg = {
          id: Date.now() + 1,
          type: "bot",
          text: data.reply || "Sorry, I couldn't process that.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
      })
      .catch(() => {
        const botMsg = {
          id: Date.now() + 1,
          type: "bot",
          text: "Oops! Couldn't reach the server. Make sure the backend is running on port 3001.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.93 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-200px)] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{
            background: "rgba(2, 6, 23, 0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                style={{ background: "rgba(59, 130, 246, 0.2)" }}
              >
                🤖
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight" style={{ color: "#fff" }}>CSEA Bot</h3>
                <p className="text-[11px] font-medium" style={{ color: "rgba(59,130,246,0.8)" }}>Online</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
            style={{ background: "rgba(0,0,0,0.15)" }}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Quick replies */}
            {messages.length <= sampleMessages.length && (
              <div className="flex flex-wrap gap-2 mt-3">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer shadow-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 py-3"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border-0 outline-none transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#fff",
                  caretColor: "#3b82f6",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0"
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                }}
                onMouseOver={(e) => { if (!input.trim()) return; e.currentTarget.style.background = "#2563eb"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#3b82f6"; }}
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}