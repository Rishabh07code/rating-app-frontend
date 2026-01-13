import React from 'react'

function StatCard({ title, value,  icon, iconColor }) {

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-50/50 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${iconColor}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>
            {/* <div className="mt-4 flex items-center text-xs text-slate-500">
                <span className={`${trend.includes('-') ? 'text-red-600' : 'text-green-600'} font-medium flex items-center mr-2`}>
                    <span className="material-symbols-outlined text-[16px]">
                        {trend.includes('0%') ? 'remove' : trend.includes('-') ? 'trending_down' : 'trending_up'}
                    </span>
                    {trend}
                </span>
                <span>vs last month</span>
            </div> */}
        </div>
    )

}

export default StatCard