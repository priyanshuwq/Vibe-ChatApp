import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import MessageInput from "./MessageInput";
import { Paper, Avatar } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { ImageOff, Trash2, MoreVertical, X, Check } from "lucide-react";

const ChatContainer = ({ onOpenSidebar = () => {} }) => {
  const { getMessages, messages, selectedUser, isMessagesLoading, deleteMessage } =
    useChatStore();

  const { socket, authUser, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const [typingUser, setTypingUser] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
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

  // Handle image error
  const handleImageError = (imageUrl) => {
    setFailedImages((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle message selection
  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  // Delete selected messages
  const handleDeleteSelected = async () => {
    if (selectedMessages.length === 0) return;
    
    if (window.confirm(`Delete ${selectedMessages.length} message(s)?`)) {
      for (const messageId of selectedMessages) {
        await deleteMessage(messageId);
      }
      setSelectedMessages([]);
      setIsDeleteMode(false);
    }
  };

  // Cancel delete mode
  const cancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedMessages([]);
  };

  return (
    <div
      className={`flex flex-col h-full w-full min-h-0 transition-colors duration-300 bg-base-200`}
    >
      {/* Chat Header */}
      <div
        className={`sticky top-0 z-10 px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b shadow-md transition-colors duration-300 bg-base-100 border-base-300`}
      >
        {/* Mobile menu button - left, does not overlap avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow"
          onClick={onOpenSidebar}
          aria-label="Open contacts"
          style={{ touchAction: 'manipulation' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </motion.button>
        <img
          src={selectedUser?.profilePic || "/avatar.png"}
          alt="User"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/avatar.png";
          }}
        />
        <div className="flex-1">
          <h2
            className={`font-semibold text-sm sm:text-base ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {selectedUser?.fullName}
          </h2>
          {typingUser ? (
            <p className="text-xs sm:text-sm text-green-400">Typing...</p>
          ) : (
            <p className={`text-xs sm:text-sm ${
              onlineUsers.includes(selectedUser?._id)
                ? "text-green-400"
                : "text-gray-500"
            }`}>
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          )}
        </div>

        {/* Delete Mode Actions */}
        {isDeleteMode ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedMessages.length} selected
            </span>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedMessages.length === 0}
              className={`p-2 rounded-full transition-colors ${
                selectedMessages.length > 0
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title="Delete selected"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={cancelDeleteMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Cancel"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          /* Three-dot Menu */
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              title="More options"
            >
              <MoreVertical size={20} />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => {
                      setIsDeleteMode(true);
                      setShowMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${
                      theme === "dark"
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <Trash2 size={16} />
                    Delete Messages
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Messages Section */}
  <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 sm:px-5 sm:py-4 space-y-3 sm:space-y-4 hide-scrollbar chat-wallpaper">
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

            const isSelected = selectedMessages.includes(msg._id);
            const canSelect = isDeleteMode && isSender;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isSender ? "justify-end" : "justify-start"} group`}
              >
                <div className="flex items-start gap-2">
                  {canSelect && (
                    <button
                      onClick={() => toggleMessageSelection(msg._id)}
                      className={`mt-2 p-1.5 rounded-full border-2 transition-all ${
                        isSelected
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-gray-400 dark:border-gray-600 hover:border-blue-500"
                      }`}
                    >
                      {isSelected ? <Check size={16} /> : <div className="w-4 h-4" />}
                    </button>
                  )}
                  
                  <div
                    className={`relative max-w-[80%] sm:max-w-[70%] px-3 sm:px-4 py-2 rounded-2xl shadow-md transition-all duration-300 ${
                      isSelected ? "ring-2 ring-blue-500" : ""
                    } ${
                      isSender
                        ? "bg-gray-700 text-gray-100 rounded-br-none"
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
                        {failedImages[msg.image] ? (
                          <div className="w-full max-w-[180px] sm:max-w-xs rounded-lg bg-gray-800 border border-gray-600 p-4 flex flex-col items-center justify-center">
                            <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-400">
                              Image unavailable
                            </p>
                          </div>
                        ) : (
                          <img
                            src={msg.image}
                            alt="attachment"
                            className="w-full max-w-[180px] sm:max-w-xs rounded-lg shadow-md border border-gray-600 object-cover"
                            onError={() => handleImageError(msg.image)}
                          />
                        )}
                      </div>
                    )}

                    {/* Timestamp */}
                    <span
                      className={`block text-right mt-1 text-[10px] sm:text-[11px] ${
                        isSender
                          ? "text-gray-300"
                          : theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {dayjs(msg.createdAt).format("MMM D, h:mm A")}
                    </span>
                  </div>
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
        className={`sticky bottom-0 z-10 border-t transition-colors duration-300 px-3 sm:px-5 py-2 sm:py-3 bg-base-100 border-base-300`}
      >
        <MessageInput selectedUser={selectedUser} />
      </div>
    </div>
  );
};

const Message = ({ message, isOwn }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex items-end mb-2 ${isOwn ? "justify-end" : "justify-start"}`}
  >
    {!isOwn && <Avatar src={message.avatar} />}
    <Paper
      elevation={3}
      sx={{
        bgcolor: isOwn ? "#1976d2" : "#222",
        color: "#fff",
        borderRadius: 3,
        px: 2,
        py: 1,
        maxWidth: 320,
        boxShadow: 3,
      }}
    >
      <div>{message.text}</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
        {dayjs(message.createdAt).format("MMM D, h:mm A")}
      </div>
    </Paper>
  </motion.div>
);

export default ChatContainer;
