import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // State
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [storeOwners, setStoreOwners] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [stores, setStores] = useState([]);
    const [availableOwners, setAvailableOwners] = useState([]);
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

    // Fetch Users (Normal Users Only)
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

    // Fetch Store Owners
    const fetchStoreOwners = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const { data } = await api.get('/admin/store-owners');
            setStoreOwners(data);
            setError(null);
        } catch (err) {
            console.error("Fetch store owners error:", err);
            setError(err.response?.data?.message || 'Failed to fetch store owners');
        }
    }, [isAdmin]);

    // Fetch Admins
    const fetchAdmins = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const { data } = await api.get('/admin/admins');
            setAdmins(data);
            setError(null);
        } catch (err) {
            console.error("Fetch admins error:", err);
            setError(err.response?.data?.message || 'Failed to fetch admins');
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

    // Fetch Available Owners (store owners without stores)
    const fetchAvailableOwners = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const { data } = await api.get('/admin/available-owners');
            setAvailableOwners(data);
            setError(null);
        } catch (err) {
            console.error("Fetch available owners error:", err);
            setError(err.response?.data?.message || 'Failed to fetch available owners');
        }
    }, [isAdmin]);

    // Add User
    const addUser = async (userData) => {
        try {
            const { data } = await api.post('/admin/users', userData);
            // Refresh appropriate list based on role
            if (userData.role === 'USER') {
                setUsers(prev => [...prev, data]);
            } else if (userData.role === 'STORE_OWNER') {
                fetchStoreOwners(); // Refresh store owners with new store info
            } else if (userData.role === 'ADMIN') {
                setAdmins(prev => [...prev, data]);
            }
            fetchStats(); // Update stats
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to create user' };
        }
    };

    // Add Store (for existing store owner)
    const addStore = async (storeData) => {
        try {
            const { data } = await api.post('/admin/stores', storeData);
            setStores(prev => [...prev, data]);
            fetchStoreOwners(); // Refresh store owners to update their store info
            fetchAvailableOwners(); // Refresh available owners list
            fetchStats(); // Update stats
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to create store' };
        }
    };

    // Initial Load
    useEffect(() => {
        // Only fetch if user is authenticated, is admin, and auth is not loading
        if (isAdmin && !authLoading && user?.token) {
            fetchStats();
            fetchUsers();
            fetchStoreOwners();
            fetchAdmins();
            fetchStores();
        }
    }, [isAdmin, authLoading, user?.token, fetchStats, fetchUsers, fetchStoreOwners, fetchAdmins, fetchStores]);

    return (
        <AdminContext.Provider
            value={{
                stats,
                users,
                storeOwners,
                admins,
                stores,
                availableOwners,
                loading,
                error,
                fetchUsers,
                fetchStoreOwners,
                fetchAdmins,
                fetchStores,
                fetchAvailableOwners,
                addUser,
                addStore
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
