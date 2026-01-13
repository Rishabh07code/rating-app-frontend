import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const { user } = useAuth();
    const isUser = user?.role === 'USER';

    const fetchStores = useCallback(async () => {
        if (!isUser) return;

        setLoading(true);
        try {
            const params = { page, limit };
            if (searchTerm) params.search = searchTerm;

            const { data } = await api.get('/user/stores', { params });

            setStores(data.data);
            setTotalPages(data.pagination.totalPages);
            setError(null);

        } catch (err) {
            console.error("Error fetching stores:", err);
            setError(err.response?.data?.message || 'Failed to fetch stores');
        } finally {
            setLoading(false);
        }
    }, [isUser, searchTerm, page]);


    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const addRating = async (storeId, rating) => {
        try {
            await api.post('/user/ratings', { storeId, score: rating });
            setStores(prev =>
                prev.map(store =>
                    store.id === storeId ? { ...store, userRating: rating } : store
                )
            );

            await fetchStores();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to submit rating'
            };
        }
    };

    const updateRating = async (storeId, rating) => {
        try {
            await api.put('/user/ratings', { storeId, score: rating });

            setStores(prev =>
                prev.map(store =>
                    store.id === storeId ? { ...store, userRating: rating } : store
                )
            );
            await fetchStores();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to update rating'
            };
        }
    };

    return (
        <StoreContext.Provider
            value={{
                stores,
                loading,
                error,
                searchTerm,
                setSearchTerm,
                page,
                setPage,
                totalPages,
                fetchStores,
                addRating,
                updateRating
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
