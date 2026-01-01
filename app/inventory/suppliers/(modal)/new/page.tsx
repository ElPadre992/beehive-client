"use client"

import DrawerShell from "@/components/drawer-shell";
import { FormField, SubheaderField } from "@/components/ui-components";
import { useCreateInventorySupplier } from "@/lib/api/inventory/suppliers";
import { fullWidthInputStyle } from "@/lib/helpers/style";
import { InventorySupplierFormValues, inventorySupplierSchema } from "@/lib/schemas/inventory/inventory-supplier.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewSupplierPage() {
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<InventorySupplierFormValues>({
        resolver: zodResolver(inventorySupplierSchema),
    });

    const { register, handleSubmit, formState, reset } = form;
    const { errors, isSubmitting } = formState;

    const router = useRouter();

    const createMutation = useCreateInventorySupplier();

    const onSubmit = (data: InventorySupplierFormValues) => {
        setFormError(null);
        createMutation.mutate(data, {
            onError: (error: any) => setFormError(error?.message || "Something went wrong"),
            onSuccess: () => {
                reset();
                router.push("/inventory/suppliers");
            },
        });
    };

    // Inline header
    const CustomHeader = () => (
        <div className="flex items-center justify-between">
            <span className="text-sm">Add a new supplier to a database.</span>
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
                {isSubmitting ? "Saving..." : "Save Supplier"}
            </button>
        </div>
    );

    return (
        <DrawerShell
            title="Create New Supplier"
            header={<CustomHeader />}
            footer={<CustomFooter onCancel={() => router.back()} onSubmit={handleSubmit(onSubmit)} />}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <div>
                    <SubheaderField label="Basic Information" />

                    <FormField label="Name" required error={errors.name?.message}>
                        <input
                            className={fullWidthInputStyle}
                            placeholder="Company name"
                            {...register("name")}
                        />
                    </FormField>

                    <FormField label="Contact" required error={errors.contact?.message}>
                        <input
                            className={fullWidthInputStyle}
                            placeholder="Contact"
                            {...register("contact")}
                        />
                    </FormField>

                    <FormField label="Email" required error={errors.email?.message}>
                        <input
                            type="email"
                            className={fullWidthInputStyle}
                            placeholder="someone@email.com"
                            {...register("email")}
                        />
                    </FormField>

                    <FormField label="Phone" error={errors.phone?.message}>
                        <input
                            type="number"
                            className={fullWidthInputStyle}
                            placeholder="Phone number"
                            {...register("phone")}
                        />
                    </FormField>

                    <FormField label="Address" error={errors.address?.message}>
                        <input
                            className={fullWidthInputStyle}
                            placeholder="Address"
                            {...register("address")}
                        />
                    </FormField>

                    <FormField label="Notes">
                        <textarea
                            rows={3}
                            className={fullWidthInputStyle}
                            placeholder="Optional notes ..."
                            {...register("notes")}
                        />
                    </FormField>
                </div>

                <div className="mt-6" />

                {formError && <p className="text-red-600 mt-4">{formError}</p>}
            </form>
        </DrawerShell>
    )
}