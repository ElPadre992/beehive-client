"use client";

import DrawerShell from "@/components/drawer-shell";
import { useCreateInventoryItem } from "@/lib/api/inventory/items";
import { InventoryCategoryLabel, UnitOfMeasureLabel } from "@/lib/enums/inventory/items";
import { InventoryItemFormValues, inventoryItemSchema } from "@/lib/schemas/inventory/inventory-item.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Reusable form field wrapper
interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

function FormField({ label, required, error, children }: FormFieldProps) {
    return (
        <div>
            <div className="flex items-start mt-4">
                <label className="w-35 font-medium mt-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex-1">{children}</div>

            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
    );
}

// Reusable select field
interface SelectFieldProps {
    label: string;
    options: Record<string, string>;
    required?: boolean;
    error?: string;
    register: any;
    name: string;
}

function SelectField({ label, options, required, error, register, name }: SelectFieldProps) {
    return (
        <FormField label={label} required={required} error={error}>
            <select className="w-full border px-3 py-2 rounded-md" {...register(name)}>
                {Object.entries(options).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </FormField>
    );
}

export default function NewItemPage() {
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<InventoryItemFormValues>({
        resolver: zodResolver(inventoryItemSchema),
        defaultValues: { quantity: 0 },
    });

    const { register, handleSubmit, formState, reset } = form;
    const { errors, isSubmitting } = formState;

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
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <hr className="mt-2 mb-4" />

                    <FormField label="SKU" required error={errors.sku?.message}>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded-md uppercase"
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
                            className="w-full border px-3 py-2 rounded-md"
                            placeholder="Stainless Steel Plate 10mm"
                            {...register("name")}
                        />
                    </FormField>

                    <FormField label="Description">
                        <textarea
                            className="w-full border px-3 py-2 rounded-md"
                            rows={3}
                            placeholder="Optional notes, specifications, or usage details"
                            {...register("description")}
                        />
                    </FormField>
                </div>

                <div className="mt-6" />

                {/* Stock & Unit */}
                <div>
                    <h2 className="text-lg font-semibold">Stock & Unit</h2>
                    <hr className="mt-2 mb-4" />

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
                            className="w-full border px-3 py-2 rounded-md"
                            {...register("minQuantity", { valueAsNumber: true })}
                        />
                    </FormField>

                    <FormField label="Max Quantity" error={errors.maxQuantity?.message}>
                        <input
                            type="number"
                            step="any"
                            className="w-full border px-3 py-2 rounded-md"
                            {...register("maxQuantity", { valueAsNumber: true })}
                        />
                    </FormField>
                </div>

                {formError && <p className="text-red-600 mt-4">{formError}</p>}
            </form>
        </DrawerShell>
    );
}