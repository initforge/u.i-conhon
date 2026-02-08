import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
    showInfo?: boolean;
}

/**
 * Reusable Pagination component with page numbers and prev/next buttons
 */
const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    showInfo = true
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 5; // Show 5 page numbers max

        if (totalPages <= showPages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Smart pagination with ellipsis
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    const startItem = (currentPage - 1) * (itemsPerPage || 20) + 1;
    const endItem = Math.min(currentPage * (itemsPerPage || 20), totalItems || 0);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {/* Info */}
            {showInfo && totalItems !== undefined && (
                <div className="text-sm text-gray-600">
                    Hiển thị {startItem}-{endItem} / {totalItems} kết quả
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-100 transition-colors"
                >
                    ← Trước
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                  ${currentPage === page
                                        ? 'bg-tet-red-600 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-100 transition-colors"
                >
                    Sau →
                </button>
            </div>
        </div>
    );
};

export default Pagination;
