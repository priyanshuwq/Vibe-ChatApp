import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import MessageInput from "./MessageInput";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import axios from "axios";

const ChatContainer = () => {
  const {
    getMessages,
    messages,
    selectedUser,
    isMessagesLoading,
    setSelectedUser,
  } = useChatStore();
  const { socket, authUser, onlineUsers } = useAuthStore();

  const [typingUser, setTypingUser] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages when user changes
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing indicator socket events
  useEffect(() => {
    if (!socket) return;

    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser?._id) {
        setTypingUser(selectedUser.fullName);
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === selectedUser?._id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("userTyping");
      socket.off("stopTyping");
    };
  }, [socket, selectedUser]);

  // Clear chat API
  const handleClearChat = async () => {
    try {
      await axios.delete(`/messages/clear/${selectedUser._id}`);
      getMessages(selectedUser._id); // Refresh after deletion
      setShowClearModal(false);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Select a contact to start chatting 💬
      </div>
    );
  }

  // Check user online status properly
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex flex-col flex-1 bg-base-100 rounded-lg shadow-md">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt="Profile"
            className="size-10 rounded-full border border-base-300"
          />
          <div>
            <h2 className="font-semibold text-base-content">
              {selectedUser.fullName}
            </h2>
            <p
              className={`text-sm ${
                typingUser
                  ? "text-primary animate-pulse"
                  : isOnline
                  ? "text-green-500"
                  : "text-zinc-400"
              }`}
            >
              {typingUser
                ? `${typingUser} is typing...`
                : isOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Clear Chat */}
          <button
            onClick={() => setShowClearModal(true)}
            className="btn btn-sm btn-error gap-1"
            title="Clear Chat"
          >
            <Trash2 className="size-4" />
          </button>

          {/* Close Chat */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-sm btn-neutral gap-1"
            title="Close Chat"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-100">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`chat ${
              msg.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            {/* Show profile pics beside messages */}
            <div className="chat-image avatar">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-base-300">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="User"
                />
              </div>
            </div>

            <div
              className={`chat-bubble ${
                msg.senderId === authUser._id
                  ? "bg-primary text-white"
                  : "bg-base-300 text-base-content"
              }`}
            >
              {/* If message has image, show it */}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="Attachment"
                  className="rounded-lg max-w-xs mb-1"
                />
              ) : null}

              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input with Image Upload */}
      <MessageInput selectedUser={selectedUser} />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-base-100 shadow-lg rounded-xl p-6 w-[95%] max-w-sm text-center"
            >
              <h3 className="text-lg font-bold text-base-content">
                Clear Chat with {selectedUser.fullName}?
              </h3>
              <p className="text-sm text-zinc-400 mt-2">
                This action cannot be undone. All messages will be deleted.
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={handleClearChat}
                  className="btn btn-error btn-sm"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearModal(false)}
                  className="btn btn-neutral btn-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatContainer;
