import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  return (
    <div className="h-screen bg-base-200 transition-colors duration-300">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-6xl h-[calc(100vh-8rem)] overflow-hidden">
          <div className="flex h-full">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Section */}
            {!selectedUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-8 bg-base-100 transition-all duration-300">
                {/* Welcome Animation */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-primary/10 p-4 rounded-2xl shadow-lg"
                    >
                      <MessageSquare className="w-10 h-10 text-primary" />
                    </motion.div>
                  </div>

                  <h1 className="text-3xl font-extrabold text-base-content">
                    Welcome,{" "}
                    <span className="text-primary">
                      {authUser?.fullName || "Guest"}
                    </span>{" "}
                    👋
                  </h1>
                  <p className="text-base-content/70 max-w-md mx-auto text-sm">
                    Start chatting with your friends, share your moments, and
                    enjoy a smooth, real-time conversation experience.
                  </p>
                </motion.div>

                {/* Chat Preview */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-base-200 rounded-xl p-5 shadow-lg w-full max-w-md border border-base-300 transition-all duration-300"
                >
                  <h2 className="text-lg font-semibold text-base-content mb-3">
                    Chat Preview
                  </h2>
                  <div className="flex flex-col gap-3">
                    <div className="bg-primary text-white p-3 rounded-2xl rounded-br-none shadow-md max-w-[75%] self-end">
                      Hey! How are you? 😊
                    </div>
                    <div className="bg-base-300 text-base-content p-3 rounded-2xl rounded-bl-none shadow-md max-w-[75%] self-start">
                      I’m doing great! How about you?
                    </div>
                    <div className="bg-primary text-white p-3 rounded-2xl rounded-br-none shadow-md max-w-[75%] self-end">
                      Same here! Excited for the new features 🚀
                    </div>
                  </div>
                </motion.div>

                {/* Instructions */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-sm text-base-content/60"
                >
                  Select a contact from the sidebar to start chatting 💬
                </motion.p>
              </div>
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
