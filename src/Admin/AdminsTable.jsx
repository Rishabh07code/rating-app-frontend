import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function AdminsTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const { admins } = useAdmin();

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

    const getUserInitial = (name) => name?.charAt(0).toUpperCase() || 'A';
    
    const getUserColor = (id) => {
        const colors = ["bg-purple-100 text-purple-600", "bg-violet-100 text-violet-600", "bg-fuchsia-100 text-fuchsia-600", "bg-pink-100 text-pink-600"];
        return colors[id % colors.length];
    };

    const filteredAdmins = admins.filter(admin => {
        const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (admin.address && admin.address.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
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
                <h2 className="text-xl font-bold text-slate-900">System Administrators</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-indigo-50/50 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                    <div className="relative max-w-sm">
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
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-purple-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${getUserColor(admin.id)}`}>
                                                {getUserInitial(admin.name)}
                                            </div>
                                            <span className="font-medium text-slate-700">{admin.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{admin.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell truncate max-w-[200px]">{admin.address}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                            <span className="material-symbols-outlined text-[14px]">shield_person</span>
                                            ADMIN
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminsTable;
