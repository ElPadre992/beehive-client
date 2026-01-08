"use client";

import DrawerShell from "@/components/ui/drawer-shell";
import { FormField } from "@/components/ui/form/form-field";
import { SubheaderField } from "@/components/ui/text/text-fields";
import { SupplierAPI } from "@/features/inventory/suppliers/supplier.api";
import { errorClass, fullWidthInputClass, infoParagraphClass } from "@/styles/shared.classes";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export default function SupplierDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const supplierId = Number(id);
    const router = useRouter();

    const { data: supplier, isLoading, error } = useQuery({
        queryKey: ["/inventory/suppliers/", supplierId],
        queryFn: () => SupplierAPI.getById(supplierId!),
        enabled: Number.isFinite(supplierId),
    })

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

    return (
        <DrawerShell
            title={supplier?.name || ""}
            header={<CustomHeader />}
            footer={<CustomFooter onBack={() => router.back()} />}
        >
            <div>
                <SubheaderField label="Basic Information" />
                <FormField label="Address">
                    <input
                        type="text"
                        className={fullWidthInputClass}
                        value={supplier?.address || ""}
                        disabled
                    />
                </FormField>
                <FormField label="Notes">
                    <textarea
                        rows={3}
                        className={fullWidthInputClass}
                        value={supplier?.notes || ""}
                        disabled
                    />
                </FormField>

                <div className="mt-6" />

                {/* Individual Contact Info */}
                <div>
                    <SubheaderField label="Contacts" />

                    {isLoading ? (
                        <p className={infoParagraphClass}>Loading contacts…</p>
                    ) : supplier?.contacts?.length === 0 ? (
                        <p className={infoParagraphClass}>
                            No contacts.
                        </p>
                    ) : (
                        supplier?.contacts?.map((contact) => (
                            <details key={contact.id} className="py-2 group">
                                <summary className="flex cursor-pointer items-center gap-2">
                                    <span>
                                        <svg
                                            className="h-4 w-4 transition-transform duration-300 ease-out group-open:rotate-90"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5 l7 7-7 7"
                                            />
                                        </svg>

                                    </span>
                                    <span className="font-medium select-none">
                                        {contact.name}
                                    </span>
                                </summary>
                                <div className="
                                    overflow-hidden transition-all duration-300 ease-out
                                    opacity-0 translate-y-1
                                    group-open:opacity-100 group-open:translate-y-0 mt-2"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex mt-4 w-90">
                                            <label className="w-15 py-2 font-medium">
                                                Name
                                            </label>

                                            <div className="w-full border border-gray-200 rounded-md p-2">
                                                {contact?.name || ""}
                                            </div>
                                        </div>

                                        <div className="flex mt-4 w-60 justify-end">
                                            <label className="w-15 py-2 font-medium px-2">
                                                Phone
                                            </label>

                                            <div className="w-full border border-gray-200 rounded-md p-2 text-right">
                                                {contact?.phone || ""}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex mt-4 w-120">
                                            <label className="w-15 py-2 font-medium">
                                                Email
                                            </label>

                                            <div className="w-full border border-gray-200 rounded-md p-2">
                                                {contact?.email || ""}
                                            </div>
                                        </div>

                                        <div className="w-30 border border-gray-200 rounded-md  mt-4 text-center">
                                            {contact?.isPrimary ?
                                                <p className="bg-green-600 font-bold py-2 rounded-md">Primary</p> :
                                                <p className="bg-gray-600 text-white py-2 rounded-md">Non Primary</p>
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="w-full text-center py-2">
                                            <label className="font-medium text-center">
                                                Notes
                                            </label>
                                        </div>

                                        <textarea
                                            rows={2}
                                            className={fullWidthInputClass}
                                            value={contact?.notes || ""}
                                            disabled
                                        />

                                    </div>

                                    <div className="mt-6" />
                                    <hr />
                                </div>
                            </details>
                        ))
                    )}
                </div>
            </div>
        </DrawerShell>
    )
}
