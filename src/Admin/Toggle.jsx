import React from 'react'

function Toggle({activeView,setActiveView}) {
    return (
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl w-fit border border-slate-200 shadow-sm">
            <button
                onClick={() => setActiveView('users')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition
                            ${activeView === 'users'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
            >
                Users
            </button>

            <button
                onClick={() => setActiveView('store-owners')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition
                            ${activeView === 'store-owners'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
            >
                Store Owners
            </button>

            <button
                onClick={() => setActiveView('admins')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition
                            ${activeView === 'admins'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
            >
                Admins
            </button>

            <button
                onClick={() => setActiveView('stores')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition
                            ${activeView === 'stores'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
            >
                Stores
            </button>
        </div>
    )
}

export default Toggle
