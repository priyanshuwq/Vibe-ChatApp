import { motion } from "framer-motion";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {

  const { selectedUser } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();


  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);


  // Normalize admin flags (can be boolean true or string "true")
  const isAdminSelected = selectedUser?.isAdmin === true || selectedUser?.isAdmin === "true";
  const isAdminCurrent = authUser?.isAdmin === true || authUser?.isAdmin === "true";
  // Show full badge if either the selected user is admin or current user is admin
  const showAdminBadge = isAdminSelected || isAdminCurrent;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-3 px-4 py-3 border-b border-base-300 bg-base-100 backdrop-blur-md shadow-sm"
    >
      {/* Profile Picture with Star Badge on Mobile */}
      <div className="relative">
        <img
          src={
            selectedUser.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt={selectedUser.fullName}
          className="w-10 h-10 rounded-full border border-primary/40 shadow-sm"
        />
        {/* Snapchat-style Star Badge on selected admin (mobile only) */}
        {isAdminSelected && (
          <span className="absolute -top-1 -right-1 sm:hidden block bg-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-yellow-400 drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 0 2px #000)' }}
            >
              <path d="M12 2.25c.31 0 .6.19.71.48l2.06 5.13 5.55.41c.31.02.57.23.66.53.09.3-.03.62-.29.8l-4.41 3.18 1.47 5.34c.08.3-.03.62-.29.8-.26.18-.6.18-.86 0L12 16.77l-4.06 3.15c-.26.18-.6.18-.86 0-.26-.18-.37-.5-.29-.8l1.47-5.34-4.41-3.18a.75.75 0 01-.29-.8c.09-.3.35-.51.66-.53l5.55-.41 2.06-5.13A.75.75 0 0112 2.25z" />
            </svg>
          </span>
        )}
        {/* Online Indicator */}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100 animate-pulse" />
        )}
      </div>

      {/* User Info */}
      <div>
        <div className="flex items-center gap-2 relative">
          <h2 className="font-semibold text-base-content">
            {selectedUser.fullName}
          </h2>
          {/* Floating admin badge above username if admin */}
          {isAdminSelected && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-black/90 text-yellow-400 border border-yellow-400 rounded-full shadow-lg animate-float">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-yellow-400"
                aria-label="Admin"
                title="Admin"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              Admin
            </span>
          )}
          {/* Permanent admin badge in topbar if current or selected user is admin */}
          {showAdminBadge && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-black text-yellow-400 border border-yellow-400 rounded-full shadow-sm ml-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              Admin
            </span>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default ChatHeader;
