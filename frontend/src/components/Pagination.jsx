export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages === 0) {
    return null;
  }

  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm px-6 py-4 border-2 border-gray-200 rounded-2xl shadow-xl">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={`relative inline-flex items-center px-4 py-2.5 border-2 text-sm font-bold rounded-xl transition-all transform ${
            hasPrevPage
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border-blue-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 hover:text-blue-700 hover:scale-105 shadow-md'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={`ml-3 relative inline-flex items-center px-4 py-2.5 border-2 text-sm font-bold rounded-xl transition-all transform ${
            hasNextPage
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border-blue-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 hover:text-blue-700 hover:scale-105 shadow-md'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">
            Showing page <span className="font-bold text-gray-900 text-lg">{page}</span> of{' '}
            <span className="font-bold text-gray-900 text-lg">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-xl shadow-lg -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrevPage}
              className={`relative inline-flex items-center px-5 py-2.5 rounded-l-xl border-2 text-sm font-bold transition-all transform ${
                hasPrevPage
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border-blue-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 hover:text-blue-700 hover:scale-105'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNextPage}
              className={`relative inline-flex items-center px-5 py-2.5 rounded-r-xl border-2 text-sm font-bold transition-all transform ${
                hasNextPage
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border-blue-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 hover:text-blue-700 hover:scale-105'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}


