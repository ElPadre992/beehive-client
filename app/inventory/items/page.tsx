"use client";

import { InventoryAPI, useDeleteInventoryItem } from "@/lib/api/inventory/items";
import { InventoryCategoryLabel, UnitOfMeasureLabel } from "@/lib/enums/inventory/items";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";



export default function InventoryItems() {
    const { data: items = [], isLoading, error } = useQuery({
        queryKey: ["inventory/items"],
        queryFn: InventoryAPI.list,
    });

    const deleteMutation = useDeleteInventoryItem();

    const GRID_COLS = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr]";

    type SortKey = "name" | "sku" | "category" | "quantity" | "unit";
    type SortDirection = "asc" | "desc";


    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");


    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");



    function handleSort(key: SortKey) {
        if (key === sortKey) {
            setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    }

    const filteredAndSortedItems = useMemo(() => {
        const filtered = items.filter(item => {
            const matchesSearch =
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.sku.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" || item.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

        return filtered.sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
            }

            return sortDirection === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [items, search, categoryFilter, sortKey, sortDirection]);

    function SortHeader({
        label,
        sortField,
    }: {
        label: string;
        sortField: SortKey;
    }) {
        const isActive = sortKey === sortField;

        return (
            <button
                onClick={() => handleSort(sortField)}
                className="flex items-center gap-1 font-semibold text-left hover:underline"
            >
                {label}
                {isActive && (
                    <span className="text-xs px-3 py-2">
                        {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                )}
            </button>
        );
    }

    if (isLoading) { return <p>Loading inventory items...</p>; }
    if (error) { return <p>Error: {(error as Error).message}</p>; }

    return (
        <div className="w-full mx-auto">
            {/* New Item */}
            <div className="p-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Items</h1>

                    {/* Search / Sort */}
                    <div className="flex items-center justify-between gap-4 ml-4 mr-4">
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search name or SKU..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="border rounded-md px-3 py-1.5 text-sm w-56"
                            />

                            {/* Category filter */}
                            <select
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}
                                className="border rounded-md px-2 py-1.5 text-sm"
                            >
                                <option value="all">All Categories</option>
                                <option value="raw">Raw Material</option>
                                <option value="finished">Finished Goods</option>
                                <option value="consumable">Consumables</option>
                            </select>
                        </div>

                        {/* Sort controls (from before) */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Sort by</label>

                            <select
                                value={sortKey}
                                onChange={e => setSortKey(e.target.value as SortKey)}
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
                                    setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
                                }
                                className="border rounded-md px-2 py-1 text-sm"
                            >
                                {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
                            </button>
                        </div>
                    </div>

                    <Link href="/inventory/items/new">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow">
                            New Item
                        </button>
                    </Link>
                </div>
            </div>

            {/* Items Table */}
            <div className="w-full border rounded-md overflow-hidden text-sm">
                {/* Header */}
                <div className={`hidden md:grid ${GRID_COLS} gap-4 px-4 py-2 border-b font-semibold bg-muted-foreground text-white`}>
                    <div className="px-3 py-2">Name</div>
                    <div className="px-3 py-2">SKU</div>
                    <div className="px-3 py-2">Category</div>
                    <div className="px-3 py-2">Quantity</div>
                    <div className="px-3 py-2">Unit</div>
                    <div className="px-3 py-2">Actions</div>
                </div>
                {/* Rows */}
                <div>
                    {filteredAndSortedItems.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-gray-500">No items match your filters.</p>
                    ) : (
                        filteredAndSortedItems?.map((item) => (
                            <div key={item.id} className={`grid ${GRID_COLS} gap-4 px-4 py-3 border-b items-center`}>
                                <div>
                                    <span className="md:hidden font-semibold">Name: </span>
                                    <div className="px-3">{item.name}</div>
                                </div>
                                <div>
                                    <span className="md:hidden font-semibold">SKU: </span>
                                    <div className="px-3">{item.sku}</div>
                                </div>
                                <div>
                                    <span className="md:hidden font-semibold">Category: </span>
                                    <div className="px-3">{InventoryCategoryLabel[item.category]}</div>
                                </div>
                                <div>
                                    <span className="md:hidden font-semibold">Quantity: </span>
                                    <div className="px-3">{item.quantity}</div>
                                </div>
                                <div>
                                    <span className="md:hidden font-semibold">Unit: </span>
                                    <div className="px-3">{UnitOfMeasureLabel[item.unit]}</div>
                                </div>

                                {/* Make sure the button works on mobile */}
                                <button
                                    onClick={() => deleteMutation.mutate(item.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        )))
                    }
                </div>
            </div>
        </div>
    )
}