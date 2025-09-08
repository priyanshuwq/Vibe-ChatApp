import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full sticky bottom-0 left-0 border-t border-base-300 bg-base-200/30 backdrop-blur-md text-center py-2 z-50"
    >
      <div className="text-sm">
        Developed by{" "}
        <span className="font-semibold text-primary">Priyanshu</span>
      </div>
      <div className="flex justify-center gap-6 mt-1">
        <a
          href="https://github.com/priyanshushekhar07"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition"
        >
          <FaGithub size={18} />
        </a>
        <a
          href="https://www.linkedin.com/in/priyanshu-shekhar-singh/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition"
        >
          <FaLinkedin size={18} />
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;
