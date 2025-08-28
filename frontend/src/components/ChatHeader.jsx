import { motion } from "framer-motion";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-3 px-4 py-3 border-b border-base-300 
                 bg-base-100 backdrop-blur-md shadow-sm"
    >
      {/* Profile Picture */}
      <div className="relative">
        <img
          src={
            selectedUser.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt={selectedUser.fullName}
          className="w-10 h-10 rounded-full border border-primary/40 shadow-sm"
        />
        {/* Online Indicator */}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100 animate-pulse" />
        )}
      </div>

      {/* User Info */}
      <div>
        <h2 className="font-semibold text-base-content">
          {selectedUser.fullName}
        </h2>
        <p className="text-xs text-base-content/60">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
