import React from 'react'

function Welcome({user}) {
  return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name.slice(0, 10)}</h2>
                <p className="text-slate-500 mt-1">Here is a list of Your Store Ratings</p>
            </div>
           
        </div>
  )
}

export default Welcome