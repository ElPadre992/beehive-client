import { z } from "zod";
import { inventorySupplierContactSchema } from "./supplier-contact.schema";

export const inventorySupplierSchema = z
    .object({
        name: z.string().min(1, "Company name is required"),
        address: z.string().optional(),
        notes: z.string().optional(),
        contacts: z
            .array(inventorySupplierContactSchema)
            .optional()
            .refine(
                contacts =>
                    !contacts ||
                    contacts.filter(c => c.isPrimary).length <= 1,
                "Only one primary contact is allowed"
            )
    })

export type SupplierFormValues = z.infer<
    typeof inventorySupplierSchema
>

export type InventorySupplier = SupplierFormValues & {
    id: number
}
