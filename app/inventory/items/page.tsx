"use client";

import { Pagination, SearchField } from "@/components/ui-components";
import { InventoryAPI, useDeleteInventoryItem } from "@/lib/api/inventory/items";
import { InventoryCategory, InventoryCategoryLabel, UnitOfMeasureLabel } from "@/lib/enums/inventory/items";
import { InventoryItem } from "@/lib/schemas/inventory/inventory-item.schema";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";


function useLocalStorageState<T>(key: string, defaultValue: T) {
    const [state, setState] = useState<T>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        }
        return defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState] as const;
}

function InventoryTable({ items, onDelete }: { items: InventoryItem[], onDelete: (id: number) => void }) {
    const GRID_COLS = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr]";
    return (
        <>
            {items.map((item) => (
                <div key={item.id} className={`grid ${GRID_COLS} gap-4 px-4 py-3 border-b items-center`}>
                    <div>{item.name}</div>
                    <div>{item.sku}</div>
                    <div>{InventoryCategoryLabel[item.category]}</div>
                    <div>{item.quantity}</div>
                    <div>{UnitOfMeasureLabel[item.unit]}</div>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </>
    );
}

export default function InventoryItems() {
    const [page, setPage] = useLocalStorageState("inventoryPage", 1);
    const [pageSize, setPageSize] = useLocalStorageState("inventoryPageSize", 20);

    const [filters, setFilters] = useState({
        search: "",
        sortBy: "name",
        sortOrder: "asc" as "asc" | "desc",
        category: "all",
    });

    const handleFilterChange = useCallback(<K extends keyof typeof filters>(
        key: K,
        value: (typeof filters)[K]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }));

        // Switch to the first page if a user is applying filters
        if (
            (key === "search" && value.trim() !== "") ||
            (key === "category" && value.trim() !== "all")
        ) {
            setPage(1);
        }
    }, []);

    const deleteMutation = useDeleteInventoryItem();

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        localStorage.setItem("inventoryPageSize", newSize.toString());
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["inventory/items", page, pageSize, filters],
        queryFn: () =>
            InventoryAPI.list({
                page,
                pageSize,
                search: filters.search,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                ...(filters.category !== "all" ? { category: filters.category } : {}),
            }),
        placeholderData: (previousData) => previousData
    });

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
                        <SearchField onSearch={(value) => handleFilterChange("search", value)} />

                        {/* Category */}
                        <select
                            value={filters.category ?? ""}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
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
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
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
                                    handleFilterChange(
                                        "sortOrder",
                                        filters.sortOrder === "asc" ? "desc" : "asc"
                                    )
                                }
                                className="border rounded-md px-2 py-1 text-sm w-18 text-left"
                            >
                                {filters.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
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
                        <InventoryTable
                            items={data?.data ?? []}
                            onDelete={(id) => deleteMutation.mutate(id)}
                        />
                    )}
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                page={page}
                pageSize={pageSize}
                isLoading={isLoading}
                totalItems={data?.total ?? 0}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    );
}