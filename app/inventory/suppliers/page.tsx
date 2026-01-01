"use client";

import { NewButton, Pagination, SearchField } from "@/components/ui-components";
import { SupplierAPI, useDeleteInventorySupplier } from "@/lib/api/inventory/suppliers";
import { SortValues, SortValuesLabel } from "@/lib/enums/inventory/suppliers";
import { useLocalStorageState } from "@/lib/helpers/common";
import { infoParagraphStyle, inputStyle, tableHeaderStyle, tableRowStyle, tableStyle, w18ButtonStyle } from "@/lib/helpers/style";
import { InventorySupplier } from "@/lib/schemas/inventory/inventory-supplier.schema";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

interface InventoryTableProps {
    items: InventorySupplier[];
    isLoading: boolean;
    onDelete: (id: number) => void;
    columnStyle: string
}

function InventoryTable({ items, isLoading, onDelete, columnStyle }: InventoryTableProps) {
    return (
        <>
            {isLoading ? (
                <p className={infoParagraphStyle}>Loading items…</p>
            ) : items.length === 0 ? (
                <p className={infoParagraphStyle}>
                    No suppliers match your filters.
                </p>
            ) : (
                items.map((item) => (
                    <div key={item.id} className={`${columnStyle} ${tableRowStyle}`}>
                        <div>{item.name}</div>
                        <div>{item.contact}</div>
                        <div>{item.email}</div>
                        <div>{item.phone}</div>
                        <div>{item.address}</div>
                        <div>{item.notes}</div>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </>
    );
}

export default function InventorySuppliers() {
    const [page, setPage] = useLocalStorageState("inventoryPage", 1);
    const [pageSize, setPageSize] = useLocalStorageState("inventoryPageSize", 20);

    const GridColumns = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr]";

    const [filters, setFilters] = useState({
        search: "",
        sortBy: "name",
        sortOrder: "asc" as "asc" | "desc",
    });

    const handleFilterChange = useCallback(<K extends keyof typeof filters>(
        key: K,
        value: (typeof filters)[K]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }));

        // Switch to the first page if a user is applying filters
        if (
            (key === "search" && value.trim() !== "")
        ) {
            setPage(1);
        }
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ["/inventory/suppliers", page, pageSize, filters],
        queryFn: () =>
            SupplierAPI.list({
                page,
                pageSize,
                search: filters.search,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            }),
        placeholderData: (previousData) => previousData
    });

    const deleteMutation = useDeleteInventorySupplier();

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        localStorage.setItem("inventoryPageSize", newSize.toString());
    };

    if (isLoading) { return <p>Loading inventory suppliers...</p>; }
    if (error) { return <p className="text-red-600">Error: {(error as Error).message}</p>; }

    return (
        <div className="w-full mx-auto">
            {/* Header / Controls */}
            <div className="flex justify-between items-center pb-6">
                <h1 className="text-3xl font-bold">Suppliers</h1>

                {/* Search / Filter / Sort */}
                <div className="flex items-center gap-2">

                    {/* Search */}
                    <SearchField onSearch={(value) => handleFilterChange("search", value)} />

                    {/* Category */}
                    {/* <select
                        value={filters.category ?? ""}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        className={inputStyle}
                    >
                        <option value="all">All Categories</option>
                        {Object.values(InventoryCategory).map((category) => (
                            <option key={category} value={category}>
                                {InventoryCategoryLabel[category]}
                            </option>
                        ))}
                    </select> */}

                    {/* Sort */}
                    <label className="text-sm font-medium">Sort</label>

                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                        className={inputStyle}
                    >
                        {Object.values(SortValues).map((value) => (
                            <option key={value} value={value}>
                                {SortValuesLabel[value]}
                            </option>
                        ))}
                    </select>

                    {/* Sort Order */}
                    <button
                        type="button"
                        onClick={() =>
                            handleFilterChange(
                                "sortOrder",
                                filters.sortOrder === "asc" ? "desc" : "asc"
                            )
                        }
                        className={w18ButtonStyle}
                    >
                        {filters.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                    </button>
                </div>

                {/* New Item */}
                <NewButton url="/inventory/suppliers/new" label="New Supplier" />
            </div>

            {/* Table */}
            <div className={tableStyle}>
                {/* Table Header */}
                <div className={`${tableHeaderStyle} ${GridColumns}`}>
                    <div>Name</div>
                    <div>Contact</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Address</div>
                    <div>Notes</div>
                    <div>Actions</div>
                </div>

                {/* Table Rows */}
                <div>
                    <InventoryTable
                        items={data?.data ?? []}
                        isLoading={isLoading}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        columnStyle={`grid ${GridColumns}`}
                    />
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
    )
}

function useDeleteSupplier() {
    throw new Error("Function not implemented.");
}
