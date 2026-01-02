import { z } from "zod";
import { SupplierContactSchema } from "./supplier-contact.schema";

export const SupplierSchema = z
    .object({
        name: z.string().min(1, "Company name is required"),
        address: z.string().optional(),
        notes: z.string().optional(),
        contacts: z
            .array(SupplierContactSchema)
            .optional()
            .refine(
                contacts =>
                    !contacts ||
                    contacts.filter(c => c.isPrimary).length <= 1,
                "Only one primary contact is allowed"
            )
    })

export type SupplierFormValues = z.infer<
    typeof SupplierSchema
>

export type Supplier = SupplierFormValues & {
    id: number
}
