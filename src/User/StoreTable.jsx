import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const StarRating = ({ rating = 0, interactive = false, onRate }) => {
    const [hover, setHover] = useState(0);
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-1">
            {stars.map((star) => (
                <span
                    key={star}
                    onClick={() => interactive && onRate(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    className={`material-symbols-outlined text-[22px] transition-colors
                        ${interactive ? 'cursor-pointer' : ''}
                        ${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}
                    `}
                >
                    star
                </span>
            ))}
            {!interactive && (
                <span className="text-xs text-slate-400 ml-1 font-medium">
                    {Number(rating || 0).toFixed(1)}
                </span>
            )}
        </div>
    );
};

function StoreTable({ pendingRatings, setPendingRatings }) {
    const { stores, addRating, updateRating } = useStore();
    const [sortField, setSortField] = useState('name'); // 'name', 'address', 'avgRating'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

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

    // Sort stores
    const sortedStores = [...stores].sort((a, b) => {
        let aVal = sortField === 'avgRating' ? (a.avgRating || 0) : (a[sortField] || '');
        let bVal = sortField === 'avgRating' ? (b.avgRating || 0) : (b[sortField] || '');
        
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    const getStoreInitial = (name) =>
        name?.charAt(0).toUpperCase() || 'S';

    const getStoreColor = (id) => {
        const colors = [
            "bg-indigo-100 text-indigo-600",
            "bg-emerald-100 text-emerald-600",
            "bg-orange-100 text-orange-600",
            "bg-blue-100 text-blue-600",
            "bg-rose-100 text-rose-600",
            "bg-purple-100 text-purple-600",
        ];
        return colors[id % colors.length];
    };

    const handleStarSelect = (storeId, value) => {
        setPendingRatings(prev => ({
            ...prev,
            [storeId]: value
        }));
    };

    const handleSubmit = async (store) => {
        const rating = pendingRatings[store.id];
        if (!rating) return;

        if (store.userRating > 0) {
            await updateRating(store.id, rating);
        } else {
            await addRating(store.id, rating);
        }

        // clear pending state
        setPendingRatings(prev => {
            const copy = { ...prev };
            delete copy[store.id];
            return copy;
        });
    };

    return (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">

                {stores.length === 0 ? (
                    <div className='flex items-center justify-center text-slate-500 text-lg w-full h-[200px]'>
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-4xl text-slate-800">store</span>
                            <p>No stores found</p>
                        </div>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-1">
                                        Store Name
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('name')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase hidden md:table-cell cursor-pointer hover:bg-slate-100" onClick={() => handleSort('address')}>
                                    <div className="flex items-center gap-1">
                                        Address
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('address')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100" onClick={() => handleSort('avgRating')}>
                                    <div className="flex items-center gap-1">
                                        Avg. Rating
                                        <span className="material-symbols-outlined text-[16px]">{getSortIcon('avgRating')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                                    Your Rating
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {sortedStores.map((store) => {
                                const selectedRating =
                                    pendingRatings[store.id] ?? store.userRating;

                                return (
                                    <tr key={store.id} className="hover:bg-indigo-50/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div
                                                    className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-lg ${getStoreColor(store.id)}`}
                                                >
                                                    {getStoreInitial(store.name)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {store.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 md:hidden">
                                                        {store.address}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">
                                            {store.address}
                                        </td>

                                        <td className="px-6 py-4">
                                            <StarRating rating={store.avgRating} />
                                        </td>

                                        <td className="px-6 py-4">
                                            <StarRating
                                                rating={selectedRating}
                                                interactive
                                                onRate={(val) =>
                                                    handleStarSelect(store.id, val)
                                                }
                                            />
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleSubmit(store)}
                                                disabled={!pendingRatings[store.id]}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition
                                                ${pendingRatings[store.id]
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                                            `}
                                            >
                                                {store.userRating > 0 ? 'Update' : 'Submit'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>)}


            </div>
        </section>
    );
}

export default StoreTable;
