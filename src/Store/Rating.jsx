import React from 'react'


export function StarRating ({ rating })  {
    return (
        <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFull = rating >= star;
                const isHalf = !isFull && rating >= star - 0.5;
                return (
                    <span
                        key={star}
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: `'FILL' ${isFull ? 1 : isHalf ? 0.5 : 0}` }}
                    >
                        {isHalf ? 'star_half' : 'star'}
                    </span>
                );
            })}
        </div>
    );
};

function RatingRow  ({ User, score, updatedAt })  {
    const initial = User?.name?.charAt(0).toUpperCase() || 'U';
    const colors = ["bg-indigo-100 text-indigo-600", "bg-purple-100 text-purple-600", "bg-emerald-100 text-emerald-600", "bg-blue-100 text-blue-600"];
    const color = colors[Math.floor(Math.random() * colors.length)]; // Deterministic based on name would be better but random for now

    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4 font-medium text-slate-900">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center font-bold text-xs`}>
                        {initial}
                    </div>
                    {User?.name}
                </div>
            </td>
            <td className="px-6 py-4 text-slate-500">{User?.email}</td>
            <td className="px-6 py-4">
                <StarRating rating={score} />
            </td>
            <td className="px-6 py-4 text-slate-500">{new Date(updatedAt).toLocaleDateString()}</td>
        </tr>
    )
};

export default RatingRow