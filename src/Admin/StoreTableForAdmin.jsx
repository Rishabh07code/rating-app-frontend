import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { StarRating } from '../Store/Rating'; // Reusing existing simple StarRating
import StoreModal from './StoreModal';

function StoreTableForAdmin() {
    const { stores } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name'); // 'name', 'email', 'address', 'rating'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

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

    const getStoreInitial = (name) => name?.charAt(0).toUpperCase() || 'S';

    // Cycle through matching colors
    const getStoreColor = (id) => {
        const colors = [
            "bg-blue-100 text-blue-600",
            "bg-orange-100 text-orange-600",
            "bg-purple-100 text-purple-600",
            "bg-emerald-100 text-emerald-600",
            "bg-rose-100 text-rose-600"
        ];
        return colors[id % colors.length];
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.email && store.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => {
        let aVal = sortField === 'rating' ? (a.rating || 0) : (a[sortField] || '');
        let bVal = sortField === 'rating' ? (b.rating || 0) : (b[sortField] || '');
        
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">Manage Stores</h2>
                <button
                    onClick={() => setIsStoreModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-200"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Add Store
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header / Search */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input
                            className="pl-10 w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
                            placeholder="Search Name, Email, or Address"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-1">
                                        Store Name
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('name')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('email')}>
                                    <div className="flex items-center gap-1">
                                        Email
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('email')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 md:table-cell hidden cursor-pointer hover:bg-slate-100" onClick={() => handleSort('address')}>
                                    <div className="flex items-center gap-1">
                                        Address
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('address')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('rating')}>
                                    <div className="flex items-center gap-1">
                                        Rating
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('rating')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStores.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">
                                        No stores found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStores.map((store) => (
                                    <tr key={store.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`size-10 rounded-lg flex items-center justify-center font-bold text-lg ${getStoreColor(store.id)}`}
                                                >
                                                    {getStoreInitial(store.name)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{store.name}</div>
                                                    <div className="text-xs text-slate-500 md:hidden">{store.address}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {store.email || <span className="text-slate-400 italic">Not set</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 md:table-cell hidden max-w-xs truncate">
                                            {store.address}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-700">{Number(store.rating || 0).toFixed(1)}</span>
                                                <StarRating rating={store.rating || 0} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <StoreModal isOpen={isStoreModalOpen} onClose={() => setIsStoreModalOpen(false)} />
        </div>
    );
}

export default StoreTableForAdmin;
