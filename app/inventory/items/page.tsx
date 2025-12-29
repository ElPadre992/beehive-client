"use client";

import { InventoryAPI, useDeleteInventoryItem } from "@/lib/api/inventory/items";
import { InventoryCategory, InventoryCategoryLabel, UnitOfMeasureLabel } from "@/lib/enums/inventory/items";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

function FormField({ label, required, error, children }: FormFieldProps) {
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

function InventorySearch({ onSearch }: { onSearch: (value: string) => void }) {
    const [input, setInput] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(input); // Trigger search after debounce
        }, 400); // 400ms delay

        return () => clearTimeout(handler); // Cancel previous timeout if input changes
    }, [input, onSearch]);

    return (
        <input
            type="text"
            placeholder="Search items..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border rounded-md px-2 py-1"
        />
    );
}

interface PageSizeSelectorProps {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
}

function PageSizeSelector({ value, onChange, options = [10, 25, 50, 100] }: PageSizeSelectorProps) {
    return (
        <FormField label="Items per page">
            <select
                className="w-24 border px-3 py-2 rounded-md"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </FormField>
    );
}

export default function InventoryItems() {
    const [page, setPage] = useState(() => {
        // On first render, read from localStorage
        if (typeof window !== "undefined") {
            return Number(localStorage.getItem("inventoryPage") || 1);
        }
        return 1;
    });
    const [pageSize, setPageSize] = useState(() => {
        // On first render, read from localStorage
        if (typeof window !== "undefined") {
            return Number(localStorage.getItem("inventoryPageSize") || 20);
        }
        return 1;
    });

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [category, setCategory] = useState<string>("all");

    const [isMounted, setIsMounted] = useState(false); // track client mount

    const deleteMutation = useDeleteInventoryItem();

    useEffect(() => {
        // Store the current page
        localStorage.setItem("inventoryPage", String(page));

        // Read the page size
        const stored = localStorage.getItem("inventoryPageSize");
        if (stored) setPageSize(Number(stored));

        setIsMounted(true);
    }, [page]);

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        localStorage.setItem("inventoryPageSize", newSize.toString());
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["inventory/items", page, pageSize, search, sortBy, sortOrder, category],
        queryFn: () =>
            InventoryAPI.list({
                page,
                pageSize,
                search,
                sortBy,
                sortOrder,
                ...(category !== "all" ? { category } : {}),
            }),
        enabled: isMounted, // only run query after client mount
        placeholderData: (previousData) => previousData
    });

    if (!isMounted) return null; // avoid hydration mismatch

    console.log(category);

    const GRID_COLS = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr]";

    if (isLoading) { return <p>Loading inventory items...</p>; }
    if (error) { return <p className="text-red-600">Error: {(error as Error).message}</p>; }

    return (
        <div className="w-full mx-auto">
            {/* Header / Controls */}
            <div className="p-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Items</h1>

                    {/* Search / Filter / Sort */}
                    <div className="flex items-center gap-4 mx-4">
                        {/* Search */}
                        <InventorySearch onSearch={(value) => {
                            setSearch(value);
                            // setPage(1); // reset to first page on new search
                        }} />

                        {/* Category */}
                        <select
                            value={category ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCategory(value === "" ? InventoryCategory.CHEMICAL : (value as InventoryCategory)); // undefined for "All"
                                setPage(1);
                            }}
                            className="border rounded-md px-2 py-1.5 text-sm"
                        >
                            <option value="all">All Categories</option>
                            {Object.values(InventoryCategory).map((category) => (
                                <option key={category} value={category}>
                                    {InventoryCategoryLabel[category]}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Sort</label>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border rounded-md px-2 py-1 text-sm"
                            >
                                <option value="name">Name</option>
                                <option value="sku">SKU</option>
                                <option value="category">Category</option>
                                <option value="quantity">Quantity</option>
                            </select>

                            <button
                                type="button"
                                onClick={() =>
                                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                                }
                                className="border rounded-md px-2 py-1 text-sm"
                            >
                                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                            </button>
                        </div>
                    </div>

                    {/* New Item */}
                    <Link href="/inventory/items/new">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow">
                            New Item
                        </button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="w-full border rounded-md overflow-hidden text-sm">
                {/* Header */}
                <div
                    className={`hidden md:grid ${GRID_COLS} gap-4 px-4 py-2 border-b font-semibold bg-muted-foreground text-white`}
                >
                    <div>Name</div>
                    <div>SKU</div>
                    <div>Category</div>
                    <div>Quantity</div>
                    <div>Unit</div>
                    <div>Actions</div>
                </div>

                {/* Rows */}
                <div>
                    {isLoading ? (
                        <p className="px-4 py-3 text-sm text-gray-500">Loading items…</p>
                    ) : data?.data.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-500">
                            No items match your filters.
                        </p>
                    ) : (
                        data?.data.map((item) => (
                            <div
                                key={item.id}
                                className={`grid ${GRID_COLS} gap-4 px-4 py-3 border-b items-center`}
                            >
                                <div>{item.name}</div>
                                <div>{item.sku}</div>
                                <div>{InventoryCategoryLabel[item.category]}</div>
                                <div>{item.quantity}</div>
                                <div>{UnitOfMeasureLabel[item.unit]}</div>

                                <button
                                    onClick={() => deleteMutation.mutate(item.id)}
                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3 text-sm">
                <span className="mt-4">
                    Page {page} of {Math.ceil((data?.total ?? 0) / pageSize)}
                </span>

                <PageSizeSelector value={pageSize} onChange={(size) => {
                    handlePageSizeChange(size);
                    setPage(1); // reset to first page when page size changes
                }} />

                <div className="flex gap-2 mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="border rounded px-3 py-1 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <button
                        disabled={page * pageSize >= (data?.total ?? 0)}
                        onClick={() => setPage((p) => p + 1)}
                        className="border rounded px-3 py-1 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}