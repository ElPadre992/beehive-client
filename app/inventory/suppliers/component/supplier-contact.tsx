
import { FormField } from "@/components/ui-components";
import { fullWidthInputStyle } from "@/lib/helpers/style";
import { SupplierFormValues } from "@/lib/schemas/inventory/supplier.schema";
import { FieldErrors, UseFieldArrayAppend, UseFormRegister } from "react-hook-form";

type Props = {
    fields: { id: string }[];
    register: UseFormRegister<SupplierFormValues>;
    append: UseFieldArrayAppend<
        SupplierFormValues,
        "contacts"
    >;
    remove: (index: number) => void;
    errors: FieldErrors<SupplierFormValues>;
};

export function SupplierContacts({
    fields,
    register,
    append,
    remove,
    errors
}: Props) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3>Contacts</h3>
                <button
                    type="button"
                    onClick={() =>
                        append({
                            name: "",
                            email: "",
                            phone: "",
                            notes: "",
                            isPrimary: false
                        })
                    }
                >
                    + Add contact
                </button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded space-y-2">
                    <div>
                        <FormField label="Contact" required error={errors.contacts?.[index]?.name?.message}>
                            <input
                                className={fullWidthInputStyle}
                                placeholder="Contact"
                                {...register(
                                    `contacts.${index}.name`
                                )}
                            />
                        </FormField>

                        <FormField label="Email" required error={errors.contacts?.[index]?.email?.message}>
                            <input
                                type="email"
                                className={fullWidthInputStyle}
                                placeholder="someone@email.com"
                                {...register(
                                    `contacts.${index}.email`
                                )}
                            />
                        </FormField>

                        <FormField label="Phone" error={errors.contacts?.[index]?.phone?.message}>
                            <input
                                type="number"
                                className={fullWidthInputStyle}
                                placeholder="Phone number"
                                {...register(
                                    `contacts.${index}.phone`
                                )}
                            />
                        </FormField>

                        <FormField label="Notes">
                            <textarea
                                rows={3}
                                className={fullWidthInputStyle}
                                placeholder="Optional notes ..."
                                {...register(
                                    `contacts.${index}.notes`
                                )}
                            />
                        </FormField>

                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    {...register(
                                        `contacts.${index}.isPrimary`
                                    )}
                                />
                                Primary contact
                            </label>
                        </div>

                        <button
                            type="button"
                            onClick={() => remove(index)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}