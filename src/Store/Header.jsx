import React from 'react'

function Header() {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Store Overview</h2>
                <p className="text-slate-500 mt-1">View your store details and performance summary.</p>
            </div>
        </div>
    )
}

export default Header