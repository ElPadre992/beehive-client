// **********************************
// PAGINATION
// **********************************

import { usePaginationShortcuts } from "@/hooks/ui/use-pagination-shortcuts";
import { compactButtonClass, paginationButtonClass } from "@/styles/shared.classes";

interface PaginationProps {
    page: number;
    pageSize: number;
    totalItems: number;
    isLoading?: boolean;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newSize: number) => void;
    pageSizeOptions?: number[];
    maxPageButtons?: number; // max number of numbered page buttons to show
}

export const Pagination: React.FC<PaginationProps> = ({
    page,
    pageSize,
    totalItems,
    isLoading = false,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
    maxPageButtons = 5,
}) => {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    usePaginationShortcuts({ page, totalPages, isLoading, onPageChange });

    const handlePageSizeChange = (newSize: number) => {
        onPageSizeChange(newSize);
        localStorage.setItem("inventoryPageSize", newSize.toString());
    };

    // Compute page numbers with ellipsis
    const getPageNumbers = (): (number | string)[] => {
        if (totalPages <= maxPageButtons) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        const half = Math.floor(maxPageButtons / 2);

        let start = Math.max(2, page - half);
        let end = Math.min(totalPages - 1, page + half);

        // Adjust for start
        if (page <= half + 1) {
            start = 2;
            end = maxPageButtons - 1;
        }

        // Adjust for end
        if (page + half >= totalPages) {
            start = totalPages - maxPageButtons + 2;
            end = totalPages - 1;
        }

        pages.push(1); // first page
        if (start > 2) pages.push("…"); // ellipsis before start
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("…"); // ellipsis after end
        pages.push(totalPages); // last page

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-between items-center py-6 text-sm">
            {/* Page size selector */}
            <div>
                <label className="mr-2">Items per page:</label>
                <select
                    className={compactButtonClass}
                    value={pageSize}
                    onChange={(e) => {
                        handlePageSizeChange(Number(e.target.value));
                        onPageChange(1);
                    }}
                    disabled={isLoading}
                >
                    {pageSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            {/* Page buttons */}
            <div className="flex gap-2">

                {/* TODO: Hide after the first time shortcuts are used */}
                <div className="text-xs text-muted-foreground mt-2">
                    Tip: <kbd>Ctrl</kbd> + <kbd>←</kbd>/<kbd>→</kbd> to change pages
                </div>

                <div>
                    <button
                        disabled={page === 1 || isLoading}
                        onClick={() => onPageChange(1)}
                        className={paginationButtonClass}
                    >
                        {"<<"}
                    </button>

                    <button
                        disabled={page === 1 || isLoading}
                        onClick={() => onPageChange(page - 1)}
                        className={paginationButtonClass}
                    >
                        {"<"}
                    </button>

                    {pageNumbers.map((p, idx) =>
                        p === "…" ? (
                            <span key={`ellipsis-${idx}`} className="px-3 py-1">
                                …
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(Number(p))}
                                className={`border rounded px-3 py-1 ${p === page ? "bg-blue-600 text-white" : ""
                                    }`}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        disabled={page === totalPages || isLoading}
                        onClick={() => onPageChange(page + 1)}
                        className={paginationButtonClass}
                    >
                        {">"}
                    </button>

                    <button
                        disabled={page === totalPages || isLoading}
                        onClick={() => onPageChange(totalPages)}
                        className={paginationButtonClass}
                    >
                        {">>"}
                    </button>
                </div>
            </div>
        </div>
    );
};