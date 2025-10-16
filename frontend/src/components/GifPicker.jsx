import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const GIPHY_API_KEY = "pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa";
const LIMIT = 20;

const GifPicker = ({ onSelectGif, onClose }) => {
  const { theme } = useThemeStore();
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const searchInputRef = useRef(null);

  const categories = ["Reactions", "Memes", "Hello", "Funny", "Thanks", "Bye"];

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    fetchGifs();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchGifs(value);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleCategoryClick = (category) => {
    setSearch(category);
    fetchGifs(category);
  };

  const fetchGifs = async (searchQuery = "") => {
    setLoading(true);
    try {
      const endpoint = searchQuery
        ? `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(
            searchQuery
          )}&api_key=${GIPHY_API_KEY}&limit=${LIMIT}&rating=pg`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${LIMIT}&rating=pg`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data && data.data) {
        // Use smallest formats for fastest loading and sending
        const processedGifs = data.data.map((gif) => ({
          id: gif.id,
          // Prioritize smallest formats (usually 50-200KB)
          url:
            gif.images.downsized_medium?.url ||
            gif.images.downsized?.url ||
            gif.images.fixed_width_small?.url,
          preview:
            gif.images.fixed_width_small?.url ||
            gif.images.fixed_height_small?.url,
          size: gif.images.downsized_medium?.size || "unknown",
        }));
        setGifs(processedGifs);
      }
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        fixed sm:absolute bottom-20 sm:bottom-16 left-1/2 sm:left-16 -translate-x-1/2 sm:translate-x-0
        w-[95%] sm:w-96 max-h-[70vh] overflow-hidden
        rounded-lg shadow-xl z-40 border flex flex-col
        ${theme === "dark" ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div
          className={`relative flex-1 flex items-center ${
            theme === "dark" ? "bg-[#2b2b2b]" : "bg-gray-100"
          } rounded-md`}
        >
          <Search
            className={`absolute left-2 w-4 h-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search GIFs..."
            value={search}
            onChange={handleSearchChange}
            className={`w-full py-1.5 pl-8 pr-4 ${
              theme === "dark"
                ? "bg-[#2b2b2b] text-white placeholder:text-gray-400"
                : "bg-gray-100 text-gray-900 placeholder:text-gray-500"
            } focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md text-sm`}
          />
        </div>
        <button
          onClick={onClose}
          className={`ml-2 p-1.5 rounded-full ${
            theme === "dark" ? "hover:bg-[#2b2b2b]" : "hover:bg-gray-200"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-700">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`text-xs px-3 py-1.5 rounded-full ${
              search === category
                ? theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : theme === "dark"
                ? "bg-[#2b2b2b] text-gray-300 hover:bg-[#333]"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* GIFs grid - scrollable area */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        <div className="grid grid-cols-3 gap-1">
        {loading ? (
          <div className="col-span-3 h-40 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : gifs.length > 0 ? (
          gifs.map((gif) => (
            <div
              key={gif.id}
              className="cursor-pointer relative aspect-square overflow-hidden rounded-md hover:opacity-80 transition-opacity"
              onClick={() => onSelectGif(gif.url)}
            >
              <img
                src={gif.preview}
                alt="GIF"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 h-40 flex items-center justify-center text-gray-500">
            No GIFs found
          </div>
        )}
        </div>
      </div>

      {/* Footer (non-scrollable) */}
      <div
        className={`p-2 border-t border-gray-700 text-center text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Powered by GIPHY • Ultra-compressed
      </div>
    </div>
  );
};

export default GifPicker;
