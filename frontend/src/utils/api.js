import axios from 'axios';

// Dynamically determine the API base URL
// Priority: 1. Environment variable 2. Current window location (for same-origin) 3. Localhost fallback
const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // If we're on a live site but VITE_API_URL is missing, 
        // try to guess the backend URL or use a relative path if served from same host
        return '/api';
    }
    return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseURL();

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const UPLOAD_URL = API_BASE_URL.replace('/api', '');

export default api;
