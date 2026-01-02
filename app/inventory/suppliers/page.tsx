"use client";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SearchField } from "@/components/ui/form/search-field";
import { Pagination } from "@/components/ui/pagination";
import { HeaderField } from "@/components/ui/text/text-fields";
import { SupplierAPI, useDeleteSupplier } from "@/features/inventory/suppliers/supplier.api";
import { Supplier } from "@/features/inventory/suppliers/supplier.schema";
import { SortValues, SortValuesLabel } from "@/features/inventory/suppliers/supplier.types";
import { useLocalStorageState } from "@/hooks/storage/use-local-storage-state";
import { compactButtonClass, infoParagraphClass, inputClass, tableClass, tableHeaderClass, tableRowClass } from "@/styles/shared.classes";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

interface InventoryTableProps {
    items: Supplier[];
    isLoading: boolean;
    onDelete: (id: number) => void;
    columnStyle: string
}

function InventoryTable({ items, isLoading, onDelete, columnStyle }: InventoryTableProps) {
    return (
        <>
            {isLoading ? (
                <p className={infoParagraphClass}>Loading suppliers…</p>
            ) : items.length === 0 ? (
                <p className={infoParagraphClass}>
                    No suppliers match your filters.
                </p>
            ) : (
                items.map((item) => (
                    <div key={item.id} className={`${columnStyle} ${tableRowClass}`}>
                        <div>{item.name}</div>
                        <div>{item.address}</div>
                        <div>{item.notes}</div>
                        <div>{item.contacts ? (item.contacts[0]?.name) : ""}</div>
                        <div>{item.contacts ? (item.contacts[0]?.email) : ""}</div>
                        <div>{item.contacts ? (item.contacts[0]?.phone) : ""}</div>
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

export default function Suppliers() {
    const [page, setPage] = useLocalStorageState("inventoryPage", 1);
    const [pageSize, setPageSize] = useLocalStorageState("inventoryPageSize", 20);

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

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        localStorage.setItem("inventoryPageSize", newSize.toString());
    };

    const GridColumns = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr]";

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

    const deleteMutation = useDeleteSupplier();



    if (isLoading) { return <p>Loading inventory suppliers...</p>; }

    if (error) {
        return (
            <div className="border border-red-300 bg-red-50 text-red-700 px-3 py-2 rounded">
                {error.message}
            </div>
        )
    }

    return (
        <div className="w-full mx-auto">
            {/* Header / Controls */}
            <div className="flex justify-between items-center pb-6">
                <HeaderField label="Suppliers" />

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
                        className={inputClass}
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
                        className={compactButtonClass}
                    >
                        {filters.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                    </button>
                </div>

                {/* New Item */}
                <PrimaryButton url="/inventory/suppliers/new" label="New Supplier" />
            </div>

            {/* Table */}
            <div className={tableClass}>
                {/* Table Header */}
                <div className={`${tableHeaderClass} ${GridColumns}`}>
                    <div>Name</div>
                    <div>Address</div>
                    <div>Notes</div>
                    <div>Contact</div>
                    <div>Email</div>
                    <div>Phone</div>
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
