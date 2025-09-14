import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import MessageInput from "./MessageInput";
import { motion } from "framer-motion";

const ChatContainer = () => {
  const { getMessages, messages, selectedUser, isMessagesLoading } =
    useChatStore();

  const { socket, authUser } = useAuthStore();
  const { theme } = useThemeStore();
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);

    if (useChatStore.getState().subscribeToMessages) {
      useChatStore.getState().subscribeToMessages();
    }

    return () => {
      if (useChatStore.getState().unsubscribeFromMessages) {
        useChatStore.getState().unsubscribeFromMessages();
      }
    };
  }, [selectedUser, getMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing indicator setup
  useEffect(() => {
    if (!socket) return;

    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser?._id) setTypingUser(senderId);
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === selectedUser?._id) setTypingUser(null);
    });

    return () => {
      socket.off("userTyping");
      socket.off("stopTyping");
    };
  }, [socket, selectedUser]);

  return (
    <div
      className={`flex flex-col h-full w-full transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0f0f0f]" : "bg-gray-100"
      }`}
    >
      {/* Chat Header */}
      <div
        className={`px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b shadow-md transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#1f1f1f] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <img
          src={selectedUser?.profilePic || "/avatar.png"}
          alt="User"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-500"
        />
        <div>
          <h2
            className={`font-semibold text-sm sm:text-base ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {selectedUser?.fullName}
          </h2>
          {typingUser && (
            <p className="text-xs sm:text-sm text-green-400">Typing...</p>
          )}
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto px-3 py-2 sm:px-5 sm:py-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {isMessagesLoading ? (
          <p
            className={`text-center text-sm sm:text-base ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading messages...
          </p>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => {
            const isSender = msg.senderId === authUser?._id;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[80%] sm:max-w-[70%] px-3 sm:px-4 py-2 rounded-2xl shadow-md transition-all duration-300 ${
                    isSender
                      ? "bg-blue-500 text-white rounded-br-none"
                      : theme === "dark"
                      ? "bg-[#1e1e1e] text-gray-100 rounded-bl-none"
                      : "bg-white text-gray-900 rounded-bl-none"
                  }`}
                >
                  {/* Message Text */}
                  {msg.text && (
                    <p className="text-sm sm:text-[15px] leading-relaxed break-words mb-1">
                      {msg.text}
                    </p>
                  )}

                  {/* Image Message */}
                  {msg.image && (
                    <div className="mt-2">
                      <img
                        src={msg.image}
                        alt="attachment"
                        className="w-full max-w-[180px] sm:max-w-xs rounded-lg shadow-md border border-gray-600 object-cover"
                      />
                    </div>
                  )}

                  {/* Timestamp */}
                  <span
                    className={`block text-right mt-1 text-[10px] sm:text-[11px] ${
                      isSender
                        ? "text-white/70"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p
            className={`text-center text-sm sm:text-base ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No messages yet
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div
        className={`border-t transition-colors duration-300 px-3 sm:px-5 py-2 sm:py-3 ${
          theme === "dark"
            ? "border-gray-800 bg-[#1f1f1f]"
            : "border-gray-200 bg-white"
        }`}
      >
        <MessageInput selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default ChatContainer;
