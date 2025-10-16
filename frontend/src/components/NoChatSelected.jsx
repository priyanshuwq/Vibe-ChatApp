import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-base-200/40 backdrop-blur-lg px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center w-full max-w-md px-4 sm:px-6 py-6 sm:py-10 rounded-2xl shadow-md bg-base-100/80 border border-base-300"
      >
        {/* Floating Icon */}
        <motion.div
          initial={{ y: -5 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-4"
        >
          <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        </motion.div>

        {/* Welcome Text */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl font-semibold text-base-content mb-2"
        >
          Welcome to Vibe Chat 🎉
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xs sm:text-sm text-base-content/60"
        >
          Select a chat from the sidebar to start messaging.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NoChatSelected;
