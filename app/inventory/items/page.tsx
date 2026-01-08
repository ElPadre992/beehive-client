"use client";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { FilterBar } from "@/components/ui/fillter-bar";
import { Pagination } from "@/components/ui/pagination";
import { HeaderField } from "@/components/ui/text/text-fields";
import ItemsDropdownMenu from "@/features/inventory/items/components/dropdown-menu";
import { useInventoryList } from "@/features/inventory/items/hooks/use-inventory-items-list";
import { useDeleteInventoryItem } from "@/features/inventory/items/item.api";
import { inventoryFilterConfig } from "@/features/inventory/items/item.filters";
import { InventoryItem } from "@/features/inventory/items/item.schema";
import { InventoryCategoryLabel, UnitOfMeasureLabel } from "@/features/inventory/items/item.types";
import { errorClass, infoParagraphClass, tableClass, tableHeaderClass, tableRowClass } from "@/styles/shared.classes";

interface InventoryTableProps {
    items: InventoryItem[];
    isLoading: boolean;
    onDelete: (id: number) => void;
    columnStyle: string
}

function InventoryTable({ items, isLoading, onDelete, columnStyle }: InventoryTableProps) {
    return (
        <>
            {isLoading ? (
                <p className={infoParagraphClass}>Loading items…</p>
            ) : items.length === 0 ? (
                <p className={infoParagraphClass}>
                    No items match your filters.
                </p>
            ) : (
                items.map((item) => (
                    <div key={item.id} className={`${columnStyle} ${tableRowClass}`}>
                        <div>{item.name}</div>
                        <div>{item.sku}</div>
                        <div>{InventoryCategoryLabel[item.category]}</div>
                        <div>{item.quantity}</div>
                        <div>{UnitOfMeasureLabel[item.unit]}</div>
                        <div className=""><ItemsDropdownMenu id={item.id} onDelete={onDelete} /></div>
                    </div>
                ))
            )}
        </>
    );
}

export default function InventoryItems() {
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
    } = useInventoryList();

    const GridColumns = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr]";

    const deleteMutation = useDeleteInventoryItem();

    if (isLoading) { return <p>Loading inventory items...</p>; }
    if (isError) { return (<p className={errorClass}>{error.message}</p>) }

    return (
        <div className="w-full mx-auto">
            {/* Header / Controls */}
            <div className="flex justify-between items-center pb-6">
                <HeaderField label="Items" />

                <FilterBar
                    filters={filters}
                    onChange={setFilter}
                    config={inventoryFilterConfig}
                />

                <PrimaryButton url="/inventory/items/new" label="New Item" />
            </div>

            {/* Table */}
            <div className={`${tableClass}`}>
                {/* Table Header */}
                <div className={`${tableHeaderClass} ${GridColumns}`}>
                    <div>Name</div>
                    <div>SKU</div>
                    <div>Category</div>
                    <div>Quantity</div>
                    <div>Unit</div>
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

            <Pagination
                page={page}
                pageSize={pageSize}
                isLoading={isLoading}
                totalItems={data?.total ?? 0}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
            />
        </div>
    );
}
