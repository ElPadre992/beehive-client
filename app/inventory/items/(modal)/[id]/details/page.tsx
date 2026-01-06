"use client";

import DrawerShell from "@/components/ui/drawer-shell";
import { FormField } from "@/components/ui/form/form-field";
import { SubheaderField } from "@/components/ui/text/text-fields";
import { InventoryItemAPI } from "@/features/inventory/items/item.api";
import { InventoryCategory, InventoryCategoryLabel, UnitOfMeasure, UnitOfMeasureLabel } from "@/features/inventory/items/item.types";
import { errorClass, fullWidthInputClass, largeCircleClass } from "@/styles/shared.classes";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

function getStockCategory(quantity: number, min: number, max: number): { label: string, color: string } {
    if (quantity <= 0) return { label: "Out Of Stock", color: "bg-red-500" };
    if (quantity > 0 && quantity < min) return { label: "Low Stock", color: "bg-amber-500 text-gray-800" };
    if (quantity >= min && quantity <= max) return { label: "Normal Stock", color: "bg-green-500 text-gray-800" };
    return { label: "Max Stock", color: "bg-blue-500" };
}

function QuantityField({ label, quantity, unit }: { label: string, quantity: number, unit: UnitOfMeasure }) {
    return (
        <div className="flex mt-4">
            <div className="w-25 py-2 font-medium">{label}</div>
            <div className="w-35 flex border border-gray-200 rounded-md p-2 justify-between">
                <div>{String(quantity)}</div>
                <div className="text-right">{UnitOfMeasureLabel[unit]}</div>
            </div>
        </div>
    )
}

export default function ItemDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const itemId = Number(id);
    const router = useRouter();

    const { data: item, isLoading, error } = useQuery({
        queryKey: ["/inventory/items/", itemId],
        queryFn: () => InventoryItemAPI.getById(itemId!),
        enabled: Number.isFinite(itemId),
    })

    const quantity = item?.quantity || 0;
    const minQuantity = item?.minQuantity || 0;
    const maxQuantity = item?.maxQuantity || 0;

    const stockStatusClass = getStockCategory(quantity, minQuantity, maxQuantity).color;
    const stockStatusLabel = getStockCategory(quantity, minQuantity, maxQuantity).label;

    const CustomHeader = () => (
        <div className="flex items-center justify-between">
            <span className="text-sm">Item details page. (Read-Only)</span>
        </div>
    );

    const CustomFooter = ({ onBack }: { onBack: () => void }) => (
        <div className="flex justify-start gap-4 pt-6">
            <button type="button" className="px-4 py-2 border rounded-md" onClick={onBack}>
                Back
            </button>
        </div>
    );

    if (isLoading) { return <p>Loading item...</p>; }
    if (error) { return (<p className={errorClass}>{error.message}</p>) }

    const category = item?.category as InventoryCategory;
    const unit = item?.unit as UnitOfMeasure;

    return (
        <DrawerShell
            title={item?.name}
            header={<CustomHeader />}
            footer={<CustomFooter onBack={() => router.back()} />}
        >
            <div>
                <SubheaderField label="Basic Information" />
                <FormField label="SKU">
                    <input
                        type="text"
                        className={fullWidthInputClass}
                        value={item?.sku}
                        disabled
                    />
                </FormField>
                <FormField label="Category">
                    <input
                        type="text"
                        className={fullWidthInputClass}
                        value={InventoryCategoryLabel[category]}
                        disabled
                    />
                </FormField>
                <FormField label="Description">
                    <textarea
                        rows={3}
                        className={fullWidthInputClass}
                        value={item?.description}
                        disabled
                    />
                </FormField>
                <div className="mt-6" />

                <div>
                    <SubheaderField label="Stock & Unit" />

                    <div className="flex justify-between">
                        <QuantityField label="Quantity" quantity={quantity} unit={unit} />
                        <div className="flex items-center justify-between gap-2 mt-4 w-35 px-4">
                            <span className={`${largeCircleClass} ${stockStatusClass}`} />
                            <span className="text-sm font-medium">{stockStatusLabel}</span>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <QuantityField label="Min Quantity" quantity={minQuantity} unit={unit} />
                        <QuantityField label="Max Quantity" quantity={maxQuantity} unit={unit} />
                    </div>
                </div>
            </div>
        </DrawerShell>
    )
}
