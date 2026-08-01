import { motion } from "motion/react";

export default function ChatbotButton({ onClick, isOpen }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "#fff",
        boxShadow: "0 8px 32px rgba(59,130,246,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
      }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </motion.button>
  );
}