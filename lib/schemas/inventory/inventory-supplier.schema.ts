import { z } from "zod";

export const inventorySupplierSchema = z
    .object({
        name: z.string().min(1, "Company name is required"),
        contact: z.string().min(1, "Contact name is required"),
        email: z.email("Valid Email address is required"),
        phone: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
    })

export type InventorySupplierFormValues = z.infer<
    typeof inventorySupplierSchema
>

export type InventorySupplier = InventorySupplierFormValues & {
    id: number
}
