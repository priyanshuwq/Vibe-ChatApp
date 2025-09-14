import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { Image, Send, X } from "lucide-react";

const MessageInput = ({ selectedUser }) => {
  const { sendMessage } = useChatStore();
  const { theme } = useThemeStore();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64 string
        setPreview(reader.result); // still show preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle send message
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !image) return;

    await sendMessage(selectedUser._id, text, image);
    setText("");
    setImage(null);
    setPreview(null);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleSend();
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 p-2 sm:p-3 border-t transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#1f1f1f] border-gray-700"
          : "bg-white border-gray-300"
      }`}
    >
      {/* Image Preview */}
      {preview && (
        <div className="relative w-24 sm:w-32">
          <img
            src={preview}
            alt="preview"
            className="rounded-lg shadow-md border border-gray-500 w-full object-cover"
          />
          <button
            onClick={() => {
              setImage(null);
              setPreview(null);
            }}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center">
        {/* Upload Image Button */}
        <label
          htmlFor="chat-image"
          className={`cursor-pointer p-1.5 sm:p-2 rounded-full transition-colors duration-300 ${
            theme === "dark"
              ? "hover:bg-gray-800 text-gray-300"
              : "hover:bg-gray-200 text-gray-600"
          }`}
        >
          <Image size={22} className="sm:size-25" />
          <input
            type="file"
            id="chat-image"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {/* Input Field */}
        <textarea
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 mx-2 sm:mx-3 rounded-xl border resize-none text-sm sm:text-base transition-all duration-300 focus:outline-none ${
            theme === "dark"
              ? "bg-[#2b2b2b] text-white placeholder-gray-400 border-gray-700 focus:border-blue-500"
              : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500"
          }`}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className={`p-1.5 sm:p-2 rounded-full transition-colors duration-300 ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <Send size={20} className="sm:size-23" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
