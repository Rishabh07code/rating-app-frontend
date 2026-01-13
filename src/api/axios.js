import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Send cookies with requests
});

// Add token to requests from cookie
api.interceptors.request.use(
    (config) => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie);
                if (userData.token) {
                    config.headers.Authorization = `Bearer ${userData.token}`;
                }
            } catch (error) {
                console.error('Failed to parse user cookie:', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Don't clear cookies or redirect if we're on auth routes or login page
            const isAuthRoute = error.config?.url?.includes('/auth/');
            const isOnLoginPage = ['/login', '/signup', '/'].includes(window.location.pathname);
            
            if (!isAuthRoute && !isOnLoginPage) {
                Cookies.remove('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
