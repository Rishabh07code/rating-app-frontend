import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // State
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Dashboard Stats
    const fetchStats = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const { data } = await api.get('/admin/dashboard');
            setStats(data);
        } catch (err) {
            console.error("Fetch stats error:", err);
        }
    }, [isAdmin]);

    // Fetch Users
    const fetchUsers = useCallback(async (filters = {}) => {
        if (!isAdmin) return;
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users', { params: filters });
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error("Fetch users error:", err);
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    // Fetch Stores
    const fetchStores = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const { data } = await api.get('/admin/stores');
            setStores(data);
        } catch (err) {
            console.error("Fetch stores error:", err);
            setError(err.response?.data?.message || 'Failed to fetch stores');
        }
    }, [isAdmin]);

    // Add User
    const addUser = async (userData) => {
        try {
            const { data } = await api.post('/admin/users', userData);
            setUsers(prev => [...prev, data]);
            fetchStats(); // Update stats
            if (userData.role === 'STORE_OWNER') fetchStores(); // Update stores list if new store created
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to create user' };
        }
    };

    // Add Store
    const addStore = async (storeData) => {
        try {
            const { data } = await api.post('/admin/stores', storeData);
            setStores(prev => [...prev, data]);
            fetchStats(); // Update stats
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to create store' };
        }
    };

    // Initial Load
    useEffect(() => {
        if (isAdmin) {
            fetchStats();
            fetchUsers();
            fetchStores();
        }
    }, [isAdmin, fetchStats, fetchUsers, fetchStores]);

    return (
        <AdminContext.Provider
            value={{
                stats,
                users,
                stores,
                loading,
                error,
                fetchUsers,
                fetchStores,
                addUser,
                addStore
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
