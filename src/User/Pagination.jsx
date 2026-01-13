import React from 'react';
import { useStore } from '../context/StoreContext';

function Pagination() {
    const { page, setPage, totalPages, loading } = useStore();

    if (totalPages <= 1) return null;

    return (
        <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
            {/* Mobile */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage(page - 1)}
                    className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md bg-white text-slate-700 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    disabled={page === totalPages || loading}
                    onClick={() => setPage(page + 1)}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md bg-white text-slate-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Desktop */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                    Page <span className="font-medium">{page}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                </p>

                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {/* Previous */}
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1 || loading}
                        className="px-2 py-2 rounded-l-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">
                            chevron_left
                        </span>
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                disabled={loading}
                                className={`px-4 py-2 border text-sm font-medium
                                    ${page === pageNumber
                                        ? 'z-10 bg-indigo-50 border-indigo-600 text-indigo-600'
                                        : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}
                                `}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    {/* Next */}
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages || loading}
                        className="px-2 py-2 rounded-r-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">
                            chevron_right
                        </span>
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default Pagination;
