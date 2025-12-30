"use client";

import DrawerShell from "@/components/drawer-shell";
import { FormField, SelectField, SubheaderField } from "@/components/ui-components";
import { useCreateInventoryItem } from "@/lib/api/inventory/items";
import { InventoryCategoryLabel, UnitOfMeasureLabel } from "@/lib/enums/inventory/items";
import { fullWidthInputStyle } from "@/lib/helpers/style";
import { InventoryItemFormValues, inventoryItemSchema } from "@/lib/schemas/inventory/inventory-item.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewItemPage() {
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<InventoryItemFormValues>({
        resolver: zodResolver(inventoryItemSchema),
        defaultValues: { quantity: 0 },
    });

    const { register, handleSubmit, formState, reset } = form;
    const { errors, isSubmitting } = formState;

    const router = useRouter();

    const createMutation = useCreateInventoryItem();

    const onSubmit = (data: InventoryItemFormValues) => {
        setFormError(null);
        createMutation.mutate(data, {
            onError: (error: any) => setFormError(error?.message || "Something went wrong"),
            onSuccess: () => {
                reset();
                router.push("/inventory/items");
            },
        });
    };

    // Inline header
    const CustomHeader = () => (
        <div className="flex items-center justify-between">
            <span className="text-sm">Add a new item to the inventory database.</span>
        </div>
    );

    // Inline footer
    const CustomFooter = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
        <div className="flex justify-end gap-4 pt-6">
            <button type="button" className="px-4 py-2 border rounded-md" onClick={onCancel}>
                Cancel
            </button>
            <button
                type="button"
                className={`px-6 py-2 rounded-md text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-600"}`}
                onClick={onSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Saving..." : "Save Item"}
            </button>
        </div>
    );

    return (
        <DrawerShell
            title="Create New Item"
            header={<CustomHeader />}
            footer={<CustomFooter onCancel={() => router.back()} onSubmit={handleSubmit(onSubmit)} />}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <div>
                    <SubheaderField label="Basic Information" />

                    <FormField label="SKU" required error={errors.sku?.message}>
                        <input
                            type="text"
                            className={fullWidthInputStyle}
                            placeholder="Internal item code (e.g. AISI304-10MM)"
                            {...register("sku")}
                        />
                    </FormField>

                    <SelectField
                        label="Category"
                        options={InventoryCategoryLabel}
                        register={register}
                        name="category"
                        error={errors.category?.message}
                    />

                    <FormField label="Name" required error={errors.name?.message}>
                        <input
                            className={fullWidthInputStyle}
                            placeholder="Stainless Steel Plate 10mm"
                            {...register("name")}
                        />
                    </FormField>

                    <FormField label="Description">
                        <textarea
                            rows={3}
                            className={fullWidthInputStyle}
                            placeholder="Optional notes, specifications, or usage details"
                            {...register("description")}
                        />
                    </FormField>
                </div>

                <div className="mt-6" />

                {/* Stock & Unit */}
                <div>
                    <SubheaderField label="Stock & Unit" />

                    <SelectField
                        label="Unit"
                        options={UnitOfMeasureLabel}
                        register={register}
                        name="unit"
                        error={errors.unit?.message}
                    />

                    <FormField label="Min Quantity" error={errors.minQuantity?.message}>
                        <input
                            type="number"
                            step="any"
                            className={fullWidthInputStyle}
                            {...register("minQuantity", { valueAsNumber: true })}
                        />
                    </FormField>

                    <FormField label="Max Quantity" error={errors.maxQuantity?.message}>
                        <input
                            type="number"
                            step="any"
                            className={fullWidthInputStyle}
                            {...register("maxQuantity", { valueAsNumber: true })}
                        />
                    </FormField>
                </div>

                {formError && <p className="text-red-600 mt-4">{formError}</p>}
            </form>
        </DrawerShell>
    );
}