import { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import api from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = Cookies.get('user');

        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Failed to parse user from cookie:', error);
                Cookies.remove('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            const userData = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                token: data.token
            };

            Cookies.set('user', JSON.stringify(userData), { expires: 7 });
            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (userData) => {
        try {
            const { data } = await api.post('/auth/signup', userData);

            const userPayload = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
            };
            console.log("Signup data:", userPayload);
            Cookies.set('user', JSON.stringify(userPayload), { expires: 7 });
            setUser(userPayload);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };


    const changePassword = async (currentPassword, newPassword) => {
        try {
            await api.put('/auth/update-password', { currentPassword, newPassword });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Password update failed' };
        }
    };

    const logout = async () => {
        // Optional: Call API to clear cookie
        // await api.post('/auth/logout'); 
        // For now just clear local state which is effectively logout for the UI
        // And you might want to call an endpoint to clear the cookie on the server side
        Cookies.remove('user');
        setUser(null);
        // Reload to ensure all states are cleared or redirected
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, changePassword, loading }}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};
