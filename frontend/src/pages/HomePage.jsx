import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-base-200 transition-colors duration-300 pt-14 sm:pt-16">
      <div className="flex items-center justify-center h-full px-2 sm:px-4 py-2 sm:py-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-6xl h-full overflow-hidden">
          <div className="flex h-full relative">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
            </AnimatePresence>

            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />

            {!selectedUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-3 sm:p-6 space-y-4 sm:space-y-10 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-gray-900/10 to-gray-800/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-gray-700/10 to-black/10 rounded-full blur-3xl"></div>
                </div>

                <AnimatePresence>
                  {!isSidebarOpen && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="md:hidden fixed left-3 sm:left-4 top-[4.5rem] sm:top-20 p-2 sm:p-2.5 rounded-xl bg-base-200/80 hover:bg-base-300/80 backdrop-blur-md border border-base-300 shadow-lg transition-all duration-300 z-50"
                      onClick={() => setIsSidebarOpen(true)}
                      aria-label="Open contacts"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-base-content">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="space-y-4 sm:space-y-8 relative z-0 w-full px-4 mt-16 sm:mt-0"
                >
                  <div className="space-y-3 sm:space-y-5 text-center">
                    <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-base-content/80 tracking-wide text-center">
                        Welcome,
                      </h1>
                      <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-gray-50 dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent tracking-tight leading-none text-center w-full break-words px-2"
                        style={{
                          letterSpacing: '-0.03em',
                          fontWeight: '800',
                          WebkitTextStroke: '0.5px rgba(0,0,0,0.1)',
                        }}
                      >
                        {authUser?.fullName || "Guest"}
                      </motion.h2>
                    </div>
                    <p className="text-base-content/60 max-w-2xl mx-auto text-base sm:text-base md:text-lg leading-relaxed font-light text-center px-2" style={{ lineHeight: '1.618' }}>
                      Connect instantly with your network. Share moments, exchange ideas, and experience seamless real-time conversations.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative bg-gray-900 dark:bg-gray-950 rounded-2xl p-4 sm:p-6 shadow-2xl w-full max-w-[90%] sm:max-w-lg border border-gray-800 transition-all duration-300 hover:shadow-3xl z-10"
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
                        P
                      </div>
                      <div className="flex flex-col gap-1 flex-1 items-start">
                        <span className="text-xs text-gray-400">pss@demo.com</span>
                        <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl rounded-tl-md text-sm">
                          Hi there!
                        </div>
                        <span className="text-xs text-gray-500">01:05 PM</span>
                      </div>
                    </motion.div>

                    {/* Message 2 - Sam */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-3 flex-row-reverse"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        S
                      </div>
                      <div className="flex flex-col gap-1 flex-1 items-end">
                        <span className="text-xs text-gray-400">sam@demo.com</span>
                        <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl rounded-tr-md text-sm">
                          Hello, how are you?
                        </div>
                        <span className="text-xs text-gray-500">01:05 PM</span>
                      </div>
                    </motion.div>

                    {/* Message 3 - PSS */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        P
                      </div>
                      <div className="flex flex-col gap-1 flex-1 items-start">
                        <span className="text-xs text-gray-400">pss@demo.com</span>
                        <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl rounded-tl-md text-sm">
                          I'm good, thanks!
                        </div>
                        <span className="text-xs text-gray-500">01:06 PM</span>
                      </div>
                    </motion.div>

                    {/* Message 4 - Sam */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="flex items-start gap-3 flex-row-reverse"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        S
                      </div>
                      <div className="flex flex-col gap-1 flex-1 items-end">
                        <span className="text-xs text-gray-400">sam@demo.com</span>
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
