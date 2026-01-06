"use client";

import DrawerShell from "@/components/ui/drawer-shell";
import { FormField } from "@/components/ui/form/form-field";
import { SelectField } from "@/components/ui/form/select-field";
import { SubheaderField } from "@/components/ui/text/text-fields";
import { InventoryItemAPI, useUpdateInventoryItem } from "@/features/inventory/items/item.api";
import { inventoryItemUpdateSchema, InventoryItemUpdateValues } from "@/features/inventory/items/item.schema";
import { InventoryCategory, InventoryCategoryLabel, UnitOfMeasure, UnitOfMeasureLabel } from "@/features/inventory/items/item.types";
import { errorClass, fullWidthInputClass } from "@/styles/shared.classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditItemPage() {
    const { id } = useParams<{ id: string }>()
    const itemId = Number(id);

    const router = useRouter();

    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<InventoryItemUpdateValues>({
        resolver: zodResolver(inventoryItemUpdateSchema),
        defaultValues: {
            sku: "",
            name: "",
            category: InventoryCategory.OTHER,
            unit: UnitOfMeasure.BOX,
            description: "",
            minQuantity: undefined,
            maxQuantity: undefined,
        },
    });

    const { register, handleSubmit, formState, reset } = form;
    const { errors, isSubmitting } = formState;

    const { data: item, isLoading, error } = useQuery({
        queryKey: ["/inventory/items/", itemId],
        queryFn: () => InventoryItemAPI.getById(itemId!),
        enabled: Number.isFinite(itemId),
    })

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!item || hasInitialized.current) return;

        form.reset({
            sku: item.sku,
            name: item.name,
            category: item.category,
            unit: item.unit,
            description: item.description ?? "",
            minQuantity: item.minQuantity,
            maxQuantity: item.maxQuantity,
        });

        hasInitialized.current = true;
    }, [item, form]);

    const updateMutation = useUpdateInventoryItem();

    const onSubmit = (values: InventoryItemUpdateValues) => {
        setFormError(null);
        updateMutation.mutate({ id: itemId, data: values }, {
            onError: (error: any) => setFormError(error?.message || "Something went wrong"),
            onSuccess: (updatedItem) => {
                form.reset(updatedItem);
                reset();
                router.push("/inventory/items");
            },
        });
    };

    // Inline header
    const CustomHeader = () => (
        <div className="flex items-center justify-between">
            <span className="text-sm">Manualy update item fields.</span>
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
                {isSubmitting ? "Saving..." : "Save"}
            </button>
        </div>
    );

    if (isLoading) { return <p>Loading item...</p>; }
    if (error) { return (<p className={errorClass}>{error.message}</p>) }

    return (
        <DrawerShell
            title="Edit Item"
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
                            className={fullWidthInputClass}
                            placeholder="Internal item code (e.g. AISI304-10MM)"
                            {...register("sku")}
                            disabled
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
                            className={fullWidthInputClass}
                            placeholder="Stainless Steel Plate 10mm"
                            {...register("name")}
                        />
                    </FormField>

                    <FormField label="Description">
                        <textarea
                            rows={3}
                            className={fullWidthInputClass}
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
                            className={fullWidthInputClass}
                            {...register("minQuantity", { valueAsNumber: true })}
                        />
                    </FormField>

                    <FormField label="Max Quantity" error={errors.maxQuantity?.message}>
                        <input
                            type="number"
                            step="any"
                            className={fullWidthInputClass}
                            {...register("maxQuantity", { valueAsNumber: true })}
                        />
                    </FormField>
                </div>

                {formError && <p className="text-red-600 mt-4">{formError}</p>}
            </form>
        </DrawerShell>
    );
}