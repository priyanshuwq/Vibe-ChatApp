import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-base-200 transition-colors duration-300">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-6xl h-[calc(100vh-8rem)] overflow-hidden">
          <div className="flex h-full relative">
            {isSidebarOpen && (
              <div
                className="sm:hidden fixed inset-0 z-30 bg-black/40"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />

            {!selectedUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-10 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-gray-900/10 to-gray-800/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-gray-700/10 to-black/10 rounded-full blur-3xl"></div>
                </div>

                <button
                  className="sm:hidden absolute left-4 top-4 p-2.5 rounded-xl bg-gradient-to-br from-base-200 to-base-300 hover:from-base-300 hover:to-base-200 border border-base-300 shadow-lg transition-all duration-300 hover:scale-105 z-10"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open contacts"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-base-content">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="space-y-6 relative z-10"
                >
                  <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-base-content tracking-tight">
                      Welcome,{" "}
                      <span className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 dark:from-gray-300 dark:via-gray-400 dark:to-gray-500 bg-clip-text text-transparent font-extrabold">
                        {authUser?.fullName || "Guest"}
                      </span>
                    </h1>
                    <p className="text-base-content/60 max-w-lg mx-auto text-base leading-relaxed font-light">
                      Connect instantly with your network. Share moments, exchange ideas, and experience seamless real-time conversations.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative bg-gray-900 dark:bg-gray-950 rounded-2xl p-6 shadow-2xl w-full max-w-lg border border-gray-800 transition-all duration-300 hover:shadow-3xl z-10"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <h2 className="text-base font-semibold text-gray-200">
                      Chat Preview
                    </h2>
                  </div>
                  
                  <div className="flex flex-col gap-4 bg-black/30 rounded-xl p-4">
                    {/* Message 1 - Alice */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        A
                      </div>
                      <div className="flex flex-col gap-1 flex-1 items-start">
                        <span className="text-xs text-gray-400">alice@demo.com</span>
                        <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl rounded-tl-md text-sm">
                          Hi there!
                        </div>
                        <span className="text-xs text-gray-500">01:05 PM</span>
                      </div>
                    </motion.div>

                    {/* Message 2 - Munni */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-3 flex-row-reverse"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        M
                      </div>
                      <div className="flex flex-col gap-1 flex-1 items-end">
                        <span className="text-xs text-gray-400">munni@demo.com</span>
                        <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl rounded-tr-md text-sm">
                          Hello, how are you?
                        </div>
                        <span className="text-xs text-gray-500">01:05 PM</span>
                      </div>
                    </motion.div>

                    {/* Message 3 - Alice */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        A
                      </div>
                      <div className="flex flex-col gap-1 flex-1 items-start">
                        <span className="text-xs text-gray-400">alice@demo.com</span>
                        <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl rounded-tl-md text-sm">
                          I'm good, thanks!
                        </div>
                        <span className="text-xs text-gray-500">01:06 PM</span>
                      </div>
                    </motion.div>

                    {/* Message 4 - Munni */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="flex items-start gap-3 flex-row-reverse"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        M
                      </div>
                      <div className="flex flex-col gap-1 flex-1 items-end">
                        <span className="text-xs text-gray-400">munni@demo.com</span>
                        <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl rounded-tr-md text-sm">
                          Great!
                        </div>
                        <span className="text-xs text-gray-500">01:06 PM</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col items-center gap-3 relative z-10"
                >
                  <p className="text-sm text-base-content/50 font-light flex items-center gap-2">
                    <span className="hidden sm:inline">Select a contact from the sidebar to start chatting</span>
                    <span className="sm:hidden">Tap the menu icon to view contacts</span>
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                  </p>
                  <div className="flex items-center gap-2 text-xs text-base-content/40">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full"></div>
                    <span>Secure</span>
                    <div className="w-1 h-1 bg-base-content/20 rounded-full"></div>
                    <span>Real-time</span>
                    <div className="w-1 h-1 bg-base-content/20 rounded-full"></div>
                    <span>Modern</span>
                  </div>
                </motion.div>
              </div>
            ) : (
              <ChatContainer onOpenSidebar={() => setIsSidebarOpen(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
