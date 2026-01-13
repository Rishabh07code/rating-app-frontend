import React from 'react'
import { StarRating } from './Rating'
import { useState } from 'react';
import { useOwner } from '../context/OwnerContext';


function TopCards({ ratings, store }) {
    const { updateStoreEmail } = useOwner();

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [email, setEmail] = useState(store.email || '');
    const [saving, setSaving] = useState(false);

    const handleSaveEmail = async () => {
        setSaving(true);
        await updateStoreEmail(email);
        setSaving(false);
        setIsEditingEmail(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-xl">
                            info
                        </span>
                        Store Details
                    </h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Store Name
                        </p>
                        <p className="text-base font-medium text-slate-900">
                            {store.name}
                        </p>
                    </div>

                    
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Store Email
                        </p>

                        {!isEditingEmail ? (
                            <div className="flex items-center gap-2">
                                <p className="text-base font-medium text-slate-900">
                                    {store.email || 'Not set'}
                                </p>
                                <span
                                    className="material-symbols-outlined text-indigo-600 text-sm cursor-pointer hover:opacity-80"
                                    onClick={() => setIsEditingEmail(true)}
                                >
                                    edit
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <button
                                    onClick={handleSaveEmail}
                                    disabled={saving}
                                    className="text-indigo-600 text-sm font-medium"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditingEmail(false);
                                        setEmail(store.email || '');
                                    }}
                                    className="text-slate-400 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    
                    <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Store Address
                        </p>
                        <div className="flex items-start gap-2">
                            <p className="text-base font-medium text-slate-900">
                                {store.address}
                            </p>
                            <span className="material-symbols-outlined text-indigo-600 text-sm mt-1 cursor-pointer">
                                map
                            </span>
                        </div>
                    </div>
                </div>
            </div>

           
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-indigo-600 text-9xl rotate-12">
                        star
                    </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Average Rating
                </h3>

                <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-bold text-slate-900 tracking-tighter">
                        {(store.rating || 0).toFixed(1)}
                    </span>
                    <span className="text-xl text-slate-400 font-medium mb-2">
                        / 5.0
                    </span>
                </div>

                <StarRating rating={store.rating || 0} />
                <p className="text-sm text-slate-400 mt-4">
                    Based on {ratings.length} reviews
                </p>
            </div>
        </div>
    );
}

export default TopCards;

