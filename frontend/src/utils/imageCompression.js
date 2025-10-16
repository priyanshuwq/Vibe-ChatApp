/**
 * Compress an image/GIF to reduce file size (optimized for speed)
 * @param {string} base64 - Base64 encoded image
 * @param {number} maxSizeKB - Maximum size in KB (default 800KB for faster uploads)
 * @returns {Promise<string>} - Compressed base64 image
 */
export const compressImage = async (base64, maxSizeKB = 800) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Calculate new dimensions - optimized for chat (smaller = faster)
      let width = img.width;
      let height = img.height;
      const maxWidth = 600; // Reduced from 800 for faster processing
      const maxHeight = 600;

      // Scale down proportionally
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress in one pass (faster)
      ctx.drawImage(img, 0, 0, width, height);

      // Single compression pass with optimized quality
      const quality = 0.75; // Good balance of quality and size
      const compressed = canvas.toDataURL("image/jpeg", quality);

      resolve(compressed);
    };

    img.onerror = reject;
    img.src = base64;
  });
};

/**
 * Check if a base64 string is within size limit
 * @param {string} base64 - Base64 string
 * @param {number} maxSizeKB - Maximum size in KB
 * @returns {boolean}
 */
export const isWithinSizeLimit = (base64, maxSizeKB) => {
  const sizeInKB = getBase64SizeKB(base64);
  return sizeInKB <= maxSizeKB;
};

/**
 * Get the size of a base64 string in KB
 * @param {string} base64 - Base64 string
 * @returns {number} - Size in KB
 */
export const getBase64SizeKB = (base64) => {
  const sizeInBytes = (base64.length * 3) / 4;
  return sizeInBytes / 1024;
};
