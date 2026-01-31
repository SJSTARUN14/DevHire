import axios from 'axios';

// Dynamically determine the API base URL
// Priority: 1. Environment variable 2. Current window location (for same-origin) 3. Localhost fallback
const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL;
    if (!url && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        url = '/api';
    }
    if (!url) url = 'http://localhost:5000/api';

    // Ensure it ends with / so axios appends relative paths correctly
    const finalUrl = url.endsWith('/') ? url : `${url}/`;
    console.log("DevHire API Base URL:", finalUrl);
    return finalUrl;
};

const API_BASE_URL = getBaseURL();

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for handling 401s (stale sessions)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expired or unauthorized. Clearing local state.");
            localStorage.removeItem('userInfo');
            // If we are not already on login/register/home, redirect or refresh
            if (!['/', '/login', '/register'].includes(window.location.pathname)) {
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

// UPLOAD_URL should be the base domain without the /api/ part
export const UPLOAD_URL = API_BASE_URL.endsWith('/api/')
    ? API_BASE_URL.slice(0, -5)
    : API_BASE_URL.replace('/api/', '');

export default api;
