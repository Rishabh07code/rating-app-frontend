import React, { useState } from 'react'
import RatingRow from './Rating';
function RatingTable({ratings}) {
  const [sortField, setSortField] = useState('userName'); // 'userName', 'userEmail', 'score', 'createdAt'
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

  const sortedRatings = [...ratings].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
      } else {
          return aVal < bVal ? 1 : -1;
      }
  });

  return (
        <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">User Ratings</h3>
                        {/* <button className="text-sm text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">sort</span>
                            Sort by Date
                        </button> */}
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('userName')}>
                                            <div className="flex items-center gap-1">
                                                User Name
                                                <span className="material-symbols-outlined text-[16px]">{getSortIcon('userName')}</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('userEmail')}>
                                            <div className="flex items-center gap-1">
                                                User Email
                                                <span className="material-symbols-outlined text-[16px]">{getSortIcon('userEmail')}</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('score')}>
                                            <div className="flex items-center gap-1">
                                                Rating
                                                <span className="material-symbols-outlined text-[16px]">{getSortIcon('score')}</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('createdAt')}>
                                            <div className="flex items-center gap-1">
                                                Submitted On
                                                <span className="material-symbols-outlined text-[16px]">{getSortIcon('createdAt')}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm">
                                    {sortedRatings.length > 0 ? sortedRatings.map((rate) => (
                                        <RatingRow key={rate.id} {...rate} />
                                    )) : (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-slate-500">No ratings yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
  )
}

export default RatingTable