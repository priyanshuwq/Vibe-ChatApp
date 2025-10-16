/**
 * Compress an image/GIF to reduce file size
 * @param {string} base64 - Base64 encoded image
 * @param {number} maxSizeKB - Maximum size in KB (default 1500KB to stay under 2MB limit)
 * @returns {Promise<string>} - Compressed base64 image
 */
export const compressImage = async (base64, maxSizeKB = 1500) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Calculate new dimensions - reasonable size for chat
      let width = img.width;
      let height = img.height;
      const maxWidth = 800; // Increased from 200
      const maxHeight = 800;

      // Scale down proportionally
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Start with reasonable compression
      let quality = 0.7;
      let compressed = canvas.toDataURL("image/jpeg", quality);

      // Reduce quality if needed to stay under limit
      while (getBase64SizeKB(compressed) > maxSizeKB && quality > 0.1) {
        quality -= 0.1;
        compressed = canvas.toDataURL("image/jpeg", quality);
      }

      // If still too large, reduce dimensions
      if (getBase64SizeKB(compressed) > maxSizeKB && width > 400) {
        width = Math.floor(width * 0.8);
        height = Math.floor(height * 0.8);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        compressed = canvas.toDataURL("image/jpeg", 0.6);
      }

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
