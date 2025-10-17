import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { Image, Send, X } from "lucide-react";
import GifPicker from "./GifPicker";
import { compressImage, getBase64SizeKB } from "../utils/imageCompression";

const MessageInput = ({ selectedUser }) => {
  const { sendMessage } = useChatStore();
  const { theme } = useThemeStore();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const gifButtonRef = useRef(null);

  // Close gif picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showGifPicker &&
        gifButtonRef.current &&
        !gifButtonRef.current.contains(event.target) &&
        !event.target.closest(".gif-picker-container")
      ) {
        setShowGifPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGifPicker]);

  // Handle image upload with fast compression
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      let imageData = reader.result;
      const sizeKB = getBase64SizeKB(imageData);

      console.log(`Original image size: ${sizeKB.toFixed(2)}KB`);

      // Fast compression to 800KB (smaller = faster upload)
      try {
        imageData = await compressImage(imageData, 800);
        const finalSize = getBase64SizeKB(imageData);
        console.log(`Compressed image to: ${finalSize.toFixed(2)}KB`);

        if (finalSize > 1500) {
          alert(
            "Image is too large even after compression. Please try a smaller image."
          );
          return;
        }
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to compress image. Please try a smaller file.");
        return;
      }

      setImage(imageData);
      setPreview(imageData);
    };
    reader.readAsDataURL(file);
  };

  // Handle GIF selection - optimized for speed (direct URL, no conversion)
  const handleGifSelect = async (gifUrl) => {
    try {
      // For small GIFs, just use the URL directly (fastest approach)
      // Convert to base64 only if needed
      const response = await fetch(gifUrl);
      const blob = await response.blob();

      // Check file size - max 800KB for fast upload
      const maxSize = 800 * 1024; // 800KB

      console.log(`GIF blob size: ${(blob.size / 1024).toFixed(2)}KB`);

      if (blob.size > maxSize) {
        alert("This GIF is too large (>800KB). Please select a smaller one.");
        setShowGifPicker(false);
        return;
      }

      // Convert blob to base64 (fast, single pass)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const sizeKB = getBase64SizeKB(base64);

        console.log(`GIF base64 size: ${sizeKB.toFixed(2)}KB`);

        // Quick validation without heavy compression
        if (sizeKB > 1000) {
          alert("This GIF is too large. Please select a smaller one.");
          setShowGifPicker(false);
          return;
        }

        setImage(base64);
        setPreview(base64);
        setShowGifPicker(false);
      };

      reader.onerror = () => {
        console.error("Error reading GIF");
        alert("Failed to load GIF. Please try another one.");
        setShowGifPicker(false);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Error loading GIF:", err);
      alert("Failed to load GIF. Please try another one.");
      setShowGifPicker(false);
    }
  };

  // Handle send message
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !image) return;

    try {
      await sendMessage({ text: text.trim(), image });
      setText("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 p-2 sm:p-3 transition-colors duration-300 ${
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
      <div className="flex items-center relative">
        {/* Upload Image Button */}
        <label
          htmlFor="chat-image"
          className={`cursor-pointer p-1.5 sm:p-2 rounded-full transition-colors duration-300 ${
            theme === "dark"
              ? "hover:bg-gray-800 text-gray-300"
              : "hover:bg-gray-200 text-gray-600"
          }`}
        >
          <Image size={22} />
          <input
            type="file"
            id="chat-image"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {/* GIF Button */}
        <button
          ref={gifButtonRef}
          onClick={() => setShowGifPicker(!showGifPicker)}
          className={`p-1.5 sm:p-2 rounded-full transition-colors duration-300 ${
            theme === "dark"
              ? "hover:bg-gray-800 text-gray-300"
              : "hover:bg-gray-200 text-gray-600"
          }`}
        >
          <div className="w-[22px] h-[22px] flex items-center justify-center font-bold text-xs">
            GIF
          </div>
        </button>

        {/* GIF Picker */}
        {showGifPicker && (
          <div className="gif-picker-container">
            <GifPicker
              onSelectGif={handleGifSelect}
              onClose={() => setShowGifPicker(false)}
            />
          </div>
        )}

        {/* Input Field */}
        <textarea
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 mx-2 sm:mx-3 rounded-xl border resize-none text-sm sm:text-base transition-all duration-300 focus:outline-none ${
            theme === "dark"
              ? "bg-[#2b2b2b] text-gray-100 placeholder-gray-400 border-gray-700 focus:border-gray-500"
              : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 focus:border-gray-500"
          }`}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className={`p-1.5 sm:p-2 rounded-full transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
