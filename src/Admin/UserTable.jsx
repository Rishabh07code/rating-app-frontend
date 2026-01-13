import React, { useState } from 'react'
import { useAdmin } from '../context/AdminContext';
function UserTable({ isModalOpen, setIsModalOpen }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All Roles'); // NEW: Role Filter State
    const [sortField, setSortField] = useState('name'); // 'name', 'email', 'address', 'role'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const { stats, users, loading } = useAdmin();

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return 'unfold_more';
        return sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    };

    // Helper for initials
    const getUserInitial = (name) => name?.charAt(0).toUpperCase() || 'U';
    // Helper for colors (cycle through some colors)
    const getUserColor = (id) => {
        const colors = ["bg-indigo-100 text-indigo-600", "bg-purple-100 text-purple-600", "bg-emerald-100 text-emerald-600", "bg-blue-100 text-blue-600"];
        return colors[id % colors.length];
    };

    // Updated Filtering Logic
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.address && u.address.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = filterRole === 'All Roles' || u.role === filterRole;

        return matchesSearch && matchesRole;
    }).sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">Manage Users</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-200"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-indigo-50/50 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </span>
                            <input
                                className="pl-10 w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20 transition-all"
                                placeholder="Search Name, Email, or Address"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20 text-slate-600"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="All Roles">All Roles</option>
                            <option value="USER">Normal User</option>
                            <option value="STORE_OWNER">Store Owner</option>
                            <option value="ADMIN">System Admin</option>
                        </select>


                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-1">
                                        Name
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('name')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('email')}>
                                    <div className="flex items-center gap-1">
                                        Email
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('email')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 hidden md:table-cell cursor-pointer hover:bg-slate-100" onClick={() => handleSort('address')}>
                                    <div className="flex items-center gap-1">
                                        Address
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('address')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('role')}>
                                    <div className="flex items-center gap-1">
                                        Role
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('role')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${getUserColor(user.id)}`}>
                                                {getUserInitial(user.name)}
                                            </div>
                                            <span className="font-medium text-slate-700">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell truncate max-w-[200px]">{user.address}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${user.role === 'STORE_OWNER' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {user.role === 'STORE_OWNER' && <span className="material-symbols-outlined text-[14px]">storefront</span>}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'STORE_OWNER' && user.Store ? (
                                            <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                                                <span>{Number(user.Store.rating || 0).toFixed(1)}</span>
                                                <span className="material-symbols-outlined text-[16px]">star</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                                            {/* <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><span className="material-symbols-outlined text-[20px]">edit</span></button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UserTable