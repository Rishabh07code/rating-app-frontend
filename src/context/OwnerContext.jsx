import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
    const { user } = useAuth();
    const isOwner = user?.role === 'STORE_OWNER';

    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOwnerDashboard = useCallback(async () => {
        if (!isOwner) return;

        setLoading(true);
        try {
            const { data } = await api.get('/owner/dashboard');
            setStore(data.store);
            setRatings(data.ratings || []);
            setAverageRating(data.averageRating || 0);
            setError(null);
        } catch (err) {
            console.error('Fetch owner dashboard error:', err);
            setError(
                err.response?.data?.message ||
                'Failed to fetch store owner dashboard'
            );
        } finally {
            setLoading(false);
        }
    }, [isOwner]);

    useEffect(() => {
        if (isOwner) {
            fetchOwnerDashboard();
        }
    }, [isOwner, fetchOwnerDashboard]);

    const updateStoreEmail = async (email) => {
        if (!isOwner) return { success: false, message: "Unauthorized" };

        try {
            const { data } = await api.put('/owner/store/email', { email });
            // Update local state
            setStore(prev => ({ ...prev, email: data.store.email }));
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update email';
            return { success: false, message: msg };
        }
    };

    return (
        <OwnerContext.Provider
            value={{
                store,
                ratings,
                averageRating,
                loading,
                error,
                fetchOwnerDashboard,
                updateStoreEmail
            }}
        >
            {children}
        </OwnerContext.Provider>
    );
};

export const useOwner = () => useContext(OwnerContext);
