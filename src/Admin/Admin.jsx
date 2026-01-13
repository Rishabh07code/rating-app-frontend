import React, { useState } from 'react';
import UserModal from './UserModel';
import Stats from './Stats';
import BubbleLoader from '../components/Laoding';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import Navbar from '../components/Navbar';
import UserTable from './UserTable';
import StoreTableForAdmin from './StoreTableForAdmin';
import Welcome from './Welcome';
import Toggle from './Toggle';

const AdminDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('users'); 
    const { user } = useAuth();
    const { stats, loading } = useAdmin();

    if (loading) return <BubbleLoader/>;

    return (
        <div className="relative min-h-screen bg-gray-200/70 text-slate-800 font-sans selection:bg-indigo-600/20 selection:text-indigo-600">
            <Navbar user={user} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
                <Welcome user={user} />
                <Stats stats={stats} />
                <Toggle activeView={activeView} setActiveView={setActiveView} />
                {activeView === 'users' ? (<UserTable isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />) : (<StoreTableForAdmin />)}
            </div>
            <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default AdminDashboard;
