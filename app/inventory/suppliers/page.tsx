"use client";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { FilterBar } from "@/components/ui/fillter-bar";
import { Pagination } from "@/components/ui/pagination";
import { HeaderField } from "@/components/ui/text/text-fields";
import { useSuppliersList } from "@/features/inventory/suppliers/hooks/use-suppliers-list";
import { useSuppliersRealtime } from "@/features/inventory/suppliers/hooks/use-suppliers-realtime";
import { useDeleteSupplier } from "@/features/inventory/suppliers/supplier.api";
import { supplierFilterConfig } from "@/features/inventory/suppliers/supplier.filters";
import { Supplier } from "@/features/inventory/suppliers/supplier.schema";
import { errorClass, infoParagraphClass, tableClass, tableHeaderClass, tableRowClass } from "@/styles/shared.classes";

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
    useSuppliersRealtime();

    const {
        data,
        isLoading,
        isError,
        error,
        page,
        setPage,
        pageSize,
        setPageSize,
        filters,
        setFilter,
    } = useSuppliersList();

    const GridColumns = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr]";

    const deleteMutation = useDeleteSupplier();

    if (isLoading) { return <p>Loading inventory suppliers...</p>; }

    if (isError) { return (<p className={errorClass}>{error.message}</p>) }

    return (
        <div className="w-full mx-auto">
            {/* Header / Controls */}
            <div className="flex justify-between items-center pb-6">
                <HeaderField label="Suppliers" />

                <FilterBar
                    filters={filters}
                    onChange={setFilter}
                    config={supplierFilterConfig}
                />

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
                onPageSizeChange={setPageSize}
            />
        </div>
    )
}
