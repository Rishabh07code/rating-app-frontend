import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function StoreOwnerTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const { storeOwners } = useAdmin();

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

    const getUserInitial = (name) => name?.charAt(0).toUpperCase() || 'S';
    
    const getUserColor = (id) => {
        const colors = ["bg-emerald-100 text-emerald-600", "bg-teal-100 text-teal-600", "bg-cyan-100 text-cyan-600", "bg-green-100 text-green-600"];
        return colors[id % colors.length];
    };

    const filteredOwners = storeOwners.filter(owner => {
        const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (owner.address && owner.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (owner.Store?.name && owner.Store.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
                <h2 className="text-xl font-bold text-slate-900">Store Owners</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-indigo-50/50 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                    <div className="relative max-w-sm">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input
                            className="pl-10 w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20 transition-all"
                            placeholder="Search Name, Email, or Store"
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
                                        Owner Name
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
                                <th className="px-6 py-4">Store Info</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOwners.map((owner) => (
                                <tr key={owner.id} className="hover:bg-emerald-50/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${getUserColor(owner.id)}`}>
                                                {getUserInitial(owner.name)}
                                            </div>
                                            <span className="font-medium text-slate-700">{owner.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{owner.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell truncate max-w-[200px]">{owner.address}</td>
                                    <td className="px-6 py-4">
                                        {owner.Store ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                                    <span className="material-symbols-outlined text-[16px] text-emerald-600">storefront</span>
                                                    {owner.Store.name}
                                                </div>
                                                <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                                    {owner.Store.address}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                <span className="material-symbols-outlined text-[14px]">warning</span>
                                                No Store
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {owner.Store ? (
                                            <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                                                <span>{Number(owner.Store.rating || 0).toFixed(1)}</span>
                                                <span className="material-symbols-outlined text-[16px]">star</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md">
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

export default StoreOwnerTable;
