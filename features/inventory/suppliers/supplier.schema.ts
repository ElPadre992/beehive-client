import { z } from "zod";
import { SupplierContactApi, SupplierContactInput } from "./supplier-contact.schema";

export const supplierSchema = z
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
    typeof supplierSchema
>

export type Supplier = SupplierApi & {
    id: number
}

export type SupplierUpdateValues = z.infer<
    typeof supplierUpdateSchema
>

export const supplierUpdateSchema = supplierSchema.partial()