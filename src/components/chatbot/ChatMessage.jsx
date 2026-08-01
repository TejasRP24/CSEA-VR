import { motion } from "motion/react";

export default function ChatMessage({ message }) {
  const isBot = message.type === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isBot ? "rounded-bl-md" : "rounded-br-md"
        }`}
        style={
          isBot
            ? {
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                color: "#fff",
              }
            : {
                background: "#3b82f6",
                color: "#fff",
              }
        }
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        <span
          className={`block mt-1 text-[10px] font-medium tracking-wide ${
            isBot ? "opacity-50" : "opacity-70"
          }`}
          style={{ color: isBot ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)" }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
}