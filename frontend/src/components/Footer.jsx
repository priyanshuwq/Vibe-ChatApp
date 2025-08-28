import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-base-100/80 backdrop-blur-md border-t border-base-300 py-3 z-40 shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center gap-2 text-sm text-base-content/70"
      >
        {/* Developer Credit */}
        <p className="flex items-center gap-1">
           Developed by{" "}
          <span className="font-semibold text-primary">
            Priyanshu Shekhar Singh
          </span>
        </p>

        {/* Social Links */}
        <div className="flex gap-5">
          <a
            href="https://github.com/priyanshushekhar07"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/priyanshu-shekhar-singh/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
