import { useEffect, useRef, useState } from "react";

// **********************************
// FORM FIELD
// **********************************

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

export function FormField({ label, required, error, children }: FormFieldProps) {
    return (
        <div>
            <div className="flex items-start mt-4">
                <label className="w-35 font-medium mt-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex-1">{children}</div>

            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
    );
}

// **********************************
// SELECT FIELD
// **********************************

interface SelectFieldProps {
    label: string;
    options: Record<string, string>;
    required?: boolean;
    error?: string;
    register: any;
    name: string;
}

export function SelectField({ label, options, required, error, register, name }: SelectFieldProps) {
    return (
        <FormField label={label} required={required} error={error}>
            <select className="w-full border px-3 py-2 rounded-md" {...register(name)}>
                {Object.entries(options).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </FormField>
    );
}

// **********************************
// SEARCH FIELD
// **********************************

function isTypingInInput(target: EventTarget | null) {
    return (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
    );
}

export function SearchField({
    onSearch,
}: {
    onSearch: (value: string) => void;
}) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    /* Debounced search */
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(input);
        }, 400);

        return () => clearTimeout(handler);
    }, [input, onSearch]);

    /* "/" to focus search */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            if (e.key === "Escape") {
                if (document.activeElement === inputRef.current) {
                    setInput("");               // clear input
                    onSearch("");               // propagate empty search
                    inputRef.current?.blur();   // remove focus
                }
            }

            // Don't steal focus while typing elsewhere
            if (isTypingInInput(target)) return;



            if ((e.key === "/" && !e.ctrlKey) || (e.ctrlKey && e.key.toLowerCase() === "k")) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                placeholder="Search…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full"
            />

            {/* Keyboard hint */}
            <kbd
                className="absolute right-2 top-1/2 -translate-y-1/2
                           text-xs border rounded px-1.5 py-0.5
                           text-muted-foreground bg-background"
            >
                /
            </kbd>
        </div>
    );
}


// **********************************
// PAGINATION
// **********************************

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

    useEffect(() => {
        if (isLoading) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            if (isLoading) return;
            if (isTypingInInput(target)) return;

            switch (e.key) {
                case 'ArrowRight':
                    if (page < totalPages) onPageChange(page + 1);
                    break;
                case 'ArrowLeft':
                    if (page > 1) onPageChange(page - 1);
                    break;
                case 'ArrowUp':
                    onPageChange(1);
                    break;
                case 'ArrowDown':
                    onPageChange(totalPages);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [page, totalPages, isLoading, onPageChange]);

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
        <div className="flex justify-between items-center px-4 py-3 text-sm flex-wrap gap-2">
            {/* Page info */}
            <span className="mt-2">
                Page {page} of {totalPages}
            </span>

            {/* Page size selector */}
            <div>
                <label className="mr-2">Items per page:</label>
                <select
                    className="w-24 border px-3 py-2 rounded-md"
                    value={pageSize}
                    onChange={(e) => {
                        onPageSizeChange(Number(e.target.value));
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
            <div className="flex gap-2 mt-2 flex-wrap">

                {/* TODO: Hide after the first time shortcuts are used */}
                <div className="text-xs text-muted-foreground mt-2">
                    Tip: <kbd>Ctrl</kbd> + <kbd>←</kbd>/<kbd>→</kbd> to change pages
                </div>

                <div>
                    <button
                        disabled={page === 1 || isLoading}
                        onClick={() => onPageChange(1)}
                        className="border rounded px-3 py-1 disabled:opacity-50"
                    >
                        {"<<"}
                    </button>

                    <button
                        disabled={page === 1 || isLoading}
                        onClick={() => onPageChange(page - 1)}
                        className="border rounded px-3 py-1 disabled:opacity-50"
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
                        className="border rounded px-3 py-1 disabled:opacity-50"
                    >
                        {">"}
                    </button>

                    <button
                        disabled={page === totalPages || isLoading}
                        onClick={() => onPageChange(totalPages)}
                        className="border rounded px-3 py-1 disabled:opacity-50"
                    >
                        {">>"}
                    </button>
                </div>
            </div>
        </div>
    );
};