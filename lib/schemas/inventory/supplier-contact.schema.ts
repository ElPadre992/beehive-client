import { z } from "zod";

export const SupplierContactSchema = z
    .object({
        name: z.string().min(1, "Contact name is required"),
        email: z.email("Valid Email address is required"),
        phone: z.string().optional(),
        notes: z.string().optional(),
        isPrimary: z.boolean().optional()
    })

export type SupplierContactFormValues = z.infer<
    typeof SupplierContactSchema
>

export type SupplierContact = SupplierContactFormValues & {
    id: number
}
