"use client";

import DrawerShell from "@/components/drawer-shell";
import { useCreateInventoryItem } from "@/lib/api/inventory/items";
import { InventoryCategory, InventoryCategoryLabel, UnitOfMeasure, UnitOfMeasureLabel } from "@/lib/enums/inventory/items";
import { InventoryItemFormValues, inventoryItemSchema } from "@/lib/schemas/inventory/inventory-item.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function CustomHeader() {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm">
                Add a new item to the inventory database.
            </span>
        </div>
    )
}

interface CustomFooterProps {
    onSubmit: () => void
    onCancel: () => void
}

function CustomFooter({ onSubmit, onCancel }: CustomFooterProps) {
    return (
        <div className="flex justify-end gap-4 pt-6">
            <button
                type="button"
                className="px-4 py-2 border rounded-md"
                onClick={onCancel}
            >
                Cancel
            </button>
            <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded-md"
                onClick={onSubmit} // call the submit handler manually
            >
                Save Item
            </button>
        </div>
    )
}


export default function NewItemPage() {
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<InventoryItemFormValues>(
        {
            resolver: zodResolver(inventoryItemSchema),
            defaultValues: {
                quantity: 0,
            }
        }
    )

    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting } = formState;

    const createMutation = useCreateInventoryItem();

    const onSubmit = (data: InventoryItemFormValues) => {
        setFormError(null);

        createMutation.mutate(data,
            {
                onError: (error: any) => {
                    setFormError(error?.message || "Something went wrong");
                },
                onSuccess: () => {
                    form.reset()
                    router.push("/inventory/items");
                },
            }
        )
    }

    return (
        <DrawerShell title="Create New Item" header={<CustomHeader />} footer={<CustomFooter onCancel={() => router.back()} onSubmit={handleSubmit(onSubmit)} />}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <div>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <hr className="mt-2 mb-4" />

                    {/* Content */}

                    {/* SKU */}
                    <div className="flex items-center mt-4">
                        <label className="w-40 font-medium">
                            SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded-md uppercase"
                            placeholder="Internal item code (e.g. AISI304-10MM)"
                            {...register("sku")}
                        />
                        {errors.sku && <p className="text-red-600">{errors.sku.message}</p>}
                    </div>
                    {/* Category */}
                    <div className="flex items-center mt-4">
                        <label className="w-40 font-medium">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select {...register("category")} className="w-full border px-3 py-2 rounded-md">
                            {Object.values(InventoryCategory).map((cat) => (
                                <option key={cat} value={cat}>
                                    {InventoryCategoryLabel[cat]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Item Name */}
                    <div className="flex items-center mt-4">
                        <label className="w-40 font-medium">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full border px-3 py-2 rounded-md"
                            placeholder="Stainless Steel Plate 10mm"
                            {...register("name")}
                        />
                        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

                    </div>

                    {/* Description */}
                    <div className="flex mt-4">
                        <label className="w-40 font-medium mt-2">
                            Description
                        </label>
                        <textarea
                            className="w-full border px-3 py-2 rounded-md"
                            rows={3}
                            {...register("description")}
                            placeholder="Optional notes, specifications, or usage details"
                        />
                    </div>
                </div>

                <div className="mt-6" />

                {/* Stock & Unit */}
                <div>
                    <h2 className="text-lg font-semibold">Stock & Unit</h2>
                    <hr className="mt-2 mb-4" />

                    {/* Unit of Measure */}
                    <div className="flex items-center mt-4">
                        <label className="w-40 font-medium mt-2">
                            Unit <span className="text-red-500">*</span>
                        </label>
                        <select {...register("unit")} className="w-full border px-3 py-2 rounded-md">
                            {Object.values(UnitOfMeasure).map((unit) => (
                                <option key={unit} value={unit}>
                                    {UnitOfMeasureLabel[unit]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Minimum Quantity */}
                    <div className="flex items-center mt-4">
                        <label className="w-40 font-medium mt-2">
                            Min Quantity
                        </label>
                        <input
                            type="number"
                            step="any"
                            className="w-full border px-3 py-2 rounded-md"
                            {...register("minQuantity", { valueAsNumber: true })}
                        />
                        {errors.minQuantity && <p className="text-red-600">{errors.minQuantity.message}</p>}
                    </div>

                    {/* Maximum Quantity */}
                    <div className="flex items-center mt-4">
                        <label className="w-40 font-medium mt-2">
                            Max Quantity
                        </label>
                        <input
                            type="number"
                            step="any"
                            className="w-full border px-3 py-2 rounded-md"
                            {...register("maxQuantity", { valueAsNumber: true })}
                        />
                        {errors.maxQuantity && <p className="text-red-600">{errors.maxQuantity.message}</p>}
                    </div>
                </div>
                {formError && <p className="text-red-600">{formError}</p>}
            </form>
        </DrawerShell>
    )
}