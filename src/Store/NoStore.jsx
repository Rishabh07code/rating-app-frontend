import React from 'react'

function NoStore({logout}) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-slate-100 p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-indigo-600 text-5xl">sentiment_dissatisfied</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">No Store Found</h2>
                <p className="text-slate-500 leading-relaxed mb-8">
                    No stores are associated with this email address. Please contact the administrator for assistance.
                </p>
                <button
                    onClick={logout}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default NoStore