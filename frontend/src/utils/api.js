import axios from 'axios';



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
    console.log("DevHire API Base URL (Active):", finalUrl);
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
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
    return config;
}, (error) => {
    return Promise.reject(error);
});


api.interceptors.response.use(
    (response) => {
        console.log(`[API RESPONSE] ${response.status} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        console.error(`[API ERROR] ${error.response?.status || 'NETWORK'} ${error.config?.url}`, error.response?.data || error.message);

        if (error.response && error.response.status === 401) {
            console.warn("Session expired or unauthorized. Clearing local state.");
            localStorage.removeItem('userInfo');

            
            const currentPath = window.location.hash.replace('#', '') || '/';
            if (!['/', '/login', '/register'].includes(currentPath)) {
                window.location.hash = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);


export const UPLOAD_URL = API_BASE_URL.endsWith('/api/')
    ? API_BASE_URL.slice(0, -5)
    : API_BASE_URL.replace('/api/', '');

export default api;
