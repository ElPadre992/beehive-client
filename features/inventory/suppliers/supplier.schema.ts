import { z } from "zod";
import { SupplierContactApi, SupplierContactInput } from "./supplier-contact.schema";

export const SupplierSchema = z
    .object({
        name: z.string().min(1, "Company name is required"),
        address: z.string().optional(),
        notes: z.string().optional(),
        contacts: z
            .array(SupplierContactInput)
            .optional()
            .refine(
                contacts =>
                    !contacts ||
                    contacts.filter(c => c.isPrimary).length <= 1,
                "Only one primary contact is allowed"
            )
    })

export const SupplierApiSchema = z
    .object({
        name: z.string().min(1, "Company name is required"),
        address: z.string().optional(),
        notes: z.string().optional(),
        contacts: z.array(SupplierContactApi)
    })

export type SupplierApi = z.infer<
    typeof SupplierApiSchema
>

export type SupplierFormValues = z.infer<
    typeof SupplierSchema
>

export type Supplier = SupplierApi & {
    id: number
}
