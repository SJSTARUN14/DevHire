import axios from 'axios';
import toast from 'react-hot-toast';

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL;

    if (!url || url === '/api' || url === '/api/') {
        if (window.location.hostname.includes('onrender.com')) {
            url = 'https://devhire-backend-ewec.onrender.com/api/';
        } else {
            url = 'http://localhost:5000/api/';
        }
    }

    const finalUrl = url.endsWith('/') ? url : `${url}/`;
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

api.interceptors.request.use((config) => {
    try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            // Attach Bearer token if it exists in localStorage
            if (parsed && parsed.token) {
                config.headers['Authorization'] = `Bearer ${parsed.token}`;
            }
        }
    } catch (e) {
        console.error("Error setting auth header", e);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// For deduplicating error messages
let lastErrorMsg = "";
let lastErrorTime = 0;

// Response interceptor to handle session expiration and global error messages
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const msg = error.response?.data?.message || error.message || "An error occurred";
        const now = Date.now();

        // Only show toast if it's a new message or enough time has passed
        // This stops the "flood" of notifications
        if (msg !== lastErrorMsg || now - lastErrorTime > 3000) {
            if (status === 401) {
                // Use a fixed ID for 401 errors so they overwrite each other rather than stacking
                toast.error(msg, { id: 'auth-error' });
            } else {
                toast.error(msg);
            }
            lastErrorMsg = msg;
            lastErrorTime = now;
        }

        if (status === 401 && (msg.toLowerCase().includes('token') || msg.toLowerCase().includes('authorized'))) {
            const currentPath = window.location.hash.replace('#', '') || '/';
            const publicPages = ['/', '/login', '/register'];

            if (!publicPages.includes(currentPath)) {
                console.warn("Unauthorized request detected. Clearing session.");
                localStorage.removeItem('userInfo');

                if (!window._redirecting) {
                    window._redirecting = true;
                    setTimeout(() => {
                        window.location.hash = '/login?expired=true';
                        setTimeout(() => window._redirecting = false, 2000);
                    }, 500);
                }
            }
        }
        return Promise.reject(error);
    }
);

export const UPLOAD_URL = API_BASE_URL.replace('/api/', '').replace(/\/$/, '');

export default api;
