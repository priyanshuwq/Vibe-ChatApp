import axios from 'axios';

// Create axios instance with CORS settings
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  maxContentLength: 1024 * 1024, // 1MB max payload
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 413) {
        console.error('Payload too large error');
        alert('The file you are trying to send is too large. Maximum size is 1MB.');
      } else if (error.response.status === 401) {
        console.error('Authentication error');
        // Redirect to login or refresh token
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error - no response received');
    }
    return Promise.reject(error);
  }
);

// API services
export const messageService = {
  sendMessage: async (receiverId, text, image) => {
    const formData = new FormData();
    
    if (text) formData.append('text', text);
    
    if (image) {
      // If image is a base64 string, convert to Blob
      if (typeof image === 'string' && image.startsWith('data:')) {
        const response = await fetch(image);
        const blob = await response.blob();
        
        // Check file size (max 1MB)
        if (blob.size > 1024 * 1024) {
          throw new Error('Image size too large (max 1MB)');
        }
        
        formData.append('image', blob, 'image.jpg');
      } else {
        formData.append('image', image);
      }
    }
    
    return api.post(`/messages/send/${receiverId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  getMessages: (userId) => api.get(`/messages/${userId}`),
};

export default api;
