import React from 'react';

interface LoadMoreButtonProps {
    onClick: () => void;
    loading?: boolean;
    hasMore: boolean;
    loadedCount: number;
    totalCount?: number;
}

/**
 * Load More button for infinite scroll / load more pattern
 * Use for mobile-friendly lists like community posts, user orders
 */
const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
    onClick,
    loading = false,
    hasMore,
    loadedCount,
    totalCount
}) => {
    if (!hasMore && loadedCount === 0) return null;

    return (
        <div className="flex flex-col items-center gap-2 mt-6">
            {/* Progress info */}
            {totalCount !== undefined && (
                <p className="text-sm text-gray-500">
                    Đã tải {loadedCount} / {totalCount}
                </p>
            )}

            {/* Load more button */}
            {hasMore && (
                <button
                    onClick={onClick}
                    disabled={loading}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg 
                     text-gray-700 font-medium transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            Đang tải...
                        </>
                    ) : (
                        <>
                            Tải thêm
                            <span className="text-gray-500">↓</span>
                        </>
                    )}
                </button>
            )}

            {/* End message */}
            {!hasMore && loadedCount > 0 && (
                <p className="text-sm text-gray-400 italic">
                    Đã hiển thị tất cả
                </p>
            )}
        </div>
    );
};

export default LoadMoreButton;
