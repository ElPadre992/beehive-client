import { z } from "zod";

export const inventorySupplierContactSchema = z
    .object({
        name: z.string().min(1, "Contact name is required"),
        email: z.email("Valid Email address is required"),
        phone: z.string().optional(),
        notes: z.string().optional(),
        isPrimary: z.boolean().optional()
    })

export type InventorySupplierContactFormValues = z.infer<
    typeof inventorySupplierContactSchema
>

export type InventorySupplier = InventorySupplierContactFormValues & {
    id: number
}
