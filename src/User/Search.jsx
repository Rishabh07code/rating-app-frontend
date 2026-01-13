import React from 'react';
import { useStore } from '../context/StoreContext';

function Search() {
    const {
        searchTerm,
        setSearchTerm
    } = useStore();

    return (
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">
                    storefront
                </span>
                Stores
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-96">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-lg">
                            search
                        </span>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by Name, Email or Address"
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default Search;
