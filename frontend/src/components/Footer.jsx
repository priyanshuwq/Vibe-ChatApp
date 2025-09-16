import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";

const Footer = () => {
  const { authUser } = useAuthStore();

  if (authUser) return null; // hide if logged in

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full fixed bottom-0 left-0 border-t border-base-300 bg-base-200/30 backdrop-blur-sm text-center py-2 z-50"
    >
      <div className="text-sm">
        Design & Developed by{" "}
        <a
          href="https://github.com/priyanshuwq"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:underline"
        >
          Priyanshu
        </a>
      </div>
      <div className="text-xs mt-1 opacity-70">
        © {new Date().getFullYear()}. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
