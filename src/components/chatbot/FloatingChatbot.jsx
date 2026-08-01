import { useState } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatWindow from "./ChatWindow";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <ChatWindow isOpen={isOpen} onClose={close} />
      <ChatbotButton onClick={toggle} isOpen={isOpen} />
    </div>
  );
}