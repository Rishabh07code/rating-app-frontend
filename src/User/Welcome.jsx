import React from 'react'

function Welcome({ user, pendingCount }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name.slice(0, 10)}</h2>
                <p className="text-slate-500 mt-1">Here is a list of stores you can rate today.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                <span className="material-symbols-outlined text-indigo-600 text-lg">info</span>
                <span>You have {pendingCount} pending reviews</span>
            </div>
        </div>
    )
}

export default Welcome