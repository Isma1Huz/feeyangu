import React from 'react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  perPage: number;
  total: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
  perPage,
  total,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        Showing {(currentPage - 1) * perPage + 1} to{' '}
        {Math.min(currentPage * perPage, total)} of {total} results
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded-md ${
              page === currentPage
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'border-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};