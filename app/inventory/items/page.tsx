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
import { errorClass, infoParagraphClass, largeCircleClass, tableClass, tableHeaderClass, tableRowClass } from "@/styles/shared.classes";

function getStockCategory(quantity: number, min: number, max: number): { label: string, color: string } {
    if (quantity <= 0) return { label: "Out Of Stock", color: "bg-red-500" };
    if (quantity > 0 && quantity < min) return { label: "Low Stock", color: "bg-amber-500 text-gray-800" };
    if (quantity >= min && quantity <= max) return { label: "Normal Stock", color: "bg-green-500 text-gray-800" };
    return { label: "Max Stock", color: "bg-blue-500" };
}

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
                items.map((item) => {
                    const quantity = item?.quantity || 0;
                    const minQuantity = item?.minQuantity || 0;
                    const maxQuantity = item?.maxQuantity || 0;

                    const stockStatusClass = getStockCategory(quantity, minQuantity, maxQuantity).color;
                    const stockStatusLabel = getStockCategory(quantity, minQuantity, maxQuantity).label;

                    return (
                        <div key={item.id} className={`${columnStyle} ${tableRowClass}`}>
                            <div>{item.name}</div>
                            <div>{item.sku}</div>
                            <div>{InventoryCategoryLabel[item.category]}</div>
                            <div>{item.quantity}</div>
                            <div>{UnitOfMeasureLabel[item.unit]}</div>
                            <div className="flex items-center gap-4">
                                <span className={`${largeCircleClass} ${stockStatusClass}`} />
                                <span className="text-sm font-medium">{stockStatusLabel}</span>
                            </div>
                            <div className=""><ItemsDropdownMenu id={item.id} onDelete={onDelete} /></div>
                        </div>
                    )
                })
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

    const GridColumns = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr]";

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
                    <div>Status</div>
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
