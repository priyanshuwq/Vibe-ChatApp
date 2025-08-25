import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const MessageInput = ({ selectedUser }) => {
  const { sendMessage } = useChatStore();
  const { socket, authUser } = useAuthStore();

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send the message
    await sendMessage({ text: message });
    setMessage("");

    // Stop typing after sending
    socket?.emit("stopTyping", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });
    setIsTyping(false);
  };

  // Handle typing events
  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socket || !selectedUser) return;

    // Emit typing event when user starts typing
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("userTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
      setIsTyping(false);
    }, 1500);
  };

  // Stop typing if user clicks away or unmounts component
  useEffect(() => {
    return () => {
      if (socket && isTyping && selectedUser) {
        socket.emit("stopTyping", {
          senderId: authUser._id,
          receiverId: selectedUser._id,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedUser, isTyping]);

  return (
    <motion.form
      onSubmit={handleSendMessage}
      className="flex items-center gap-3 p-3 border-t border-base-300 bg-base-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Input Field */}
      <input
        type="text"
        value={message}
        onChange={handleTyping}
        placeholder="Type a message..."
        className="input input-bordered flex-1 bg-base-200 text-base-content focus:outline-none"
      />

      {/* Send Button */}
      <motion.button
        type="submit"
        className="btn btn-primary btn-circle"
        disabled={!message.trim()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Send className="size-5" />
      </motion.button>
    </motion.form>
  );
};

export default MessageInput;
