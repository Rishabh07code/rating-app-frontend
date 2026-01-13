import React from 'react'
import StatCard from './StatCard'

function Stats({stats}) {
    const statCards = [
        { title: "Total Users", value: stats.totalUsers || 0, icon: "group", iconColor: "bg-blue-50 text-blue-600" },
        { title: "Total Stores", value: stats.totalStores || 0, icon: "storefront", iconColor: "bg-purple-50 text-purple-600" },
        { title: "Total Ratings", value: stats.totalRatings || 0, icon: "star", iconColor: "bg-amber-50 text-amber-600" },
    ];
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}

            </div>
        </div>
    )
}

export default Stats