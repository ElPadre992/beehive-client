"use client";

import { SupplierContacts } from "@/app/inventory/suppliers/component/supplier-contact";
import DrawerShell from "@/components/ui/drawer-shell";
import { FormField } from "@/components/ui/form/form-field";
import { SubheaderField } from "@/components/ui/text/text-fields";
import { SupplierAPI, useUpdateSupplier } from "@/features/inventory/suppliers/supplier.api";
import { SupplierFormValues, supplierSchema, SupplierUpdateValues } from "@/features/inventory/suppliers/supplier.schema";
import { errorClass, fullWidthInputClass } from "@/styles/shared.classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function EditSupplierPage() {
    const { id } = useParams<{ id: string }>()
    const supplierId = Number(id);

    const router = useRouter();

    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<SupplierFormValues>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            name: "",
            address: "",
            notes: undefined,
            contacts: [{
                name: "",
                phone: "",
                email: "",
                notes: "",
                isPrimary: false,
            }]
        },
    });

    const { register, control, handleSubmit, formState, reset, setValue, getValues } = form;
    const { errors, isSubmitting } = formState;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "contacts"
    });

    const removeContact = (index: number) => {
        const contacts = getValues("contacts");

        const removedWasPrimary = contacts?.[index]?.isPrimary;

        // Remove the contact
        remove(index);

        // If we removed the primary contact, promote the first remaining one
        if (removedWasPrimary && contacts && contacts.length > 1) {
            // After removal, the new first contact is index 0
            setValue("contacts.0.isPrimary", true);
        }
    };

    const { data: supplier, isLoading, error } = useQuery({
        queryKey: ["/inventory/suppliers", supplierId],
        queryFn: () => SupplierAPI.getById(supplierId!),
        enabled: Number.isFinite(supplierId),
    })

    const isDirty = form.formState.isDirty;

    useEffect(() => {
        if (!supplier || isDirty) return;

        form.reset({
            name: supplier.name,
            address: supplier.address ?? "",
            notes: supplier.notes ?? "",
            contacts: supplier.contacts ?? [],
        });
    }, [supplier, form, isDirty]);

    const updateMutation = useUpdateSupplier();

    const onSubmit = (values: SupplierUpdateValues) => {
        setFormError(null);
        updateMutation.mutate({ id: supplierId, data: values }, {
            onError: (error: any) => setFormError(error?.message || "Something went wrong"),
            onSuccess: (updatedSupplier) => {
                form.reset(updatedSupplier);
                reset();
                router.push("/inventory/suppliers");
            },
        });
    };

    // Inline header
    const CustomHeader = () => (
        <div className="flex items-center justify-between">
            <span className="text-sm">Manualy update supplier fields.</span>
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

    if (isLoading) { return <p>Loading supplier...</p>; }
    if (error) { return (<p className={errorClass}>{error.message}</p>) }

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
                            className={fullWidthInputClass}
                            placeholder="Company name"
                            {...register("name")}
                        />
                    </FormField>

                    <FormField label="Address" error={errors.address?.message}>
                        <input
                            className={fullWidthInputClass}
                            placeholder="Address"
                            {...register("address")}
                        />
                    </FormField>

                    <FormField label="Notes">
                        <textarea
                            rows={3}
                            className={fullWidthInputClass}
                            placeholder="Optional notes ..."
                            {...register("notes")}
                        />
                    </FormField>
                </div>

                <div>
                    {/* Contacts */}
                    <SupplierContacts
                        fields={fields}
                        register={register}
                        remove={removeContact}
                        append={append}
                        errors={errors}
                    />
                </div>

                <div className="mt-6" />

                {formError && <p className="text-red-600 mt-4">{formError}</p>}
            </form>
        </DrawerShell>
    );
}