import { z } from "zod";
import { InventoryCategory, UnitOfMeasure } from "../../enums/inventory/items";

export const inventoryItemSchema = z
    .object({
        sku: z.string().min(1, "SKU is required"),
        name: z.string().min(1, "Name is required"),
        category: z.enum(InventoryCategory),
        description: z.string().optional(),
        quantity: z.number().nonnegative("Quantity cannot be negative"),
        unit: z.enum(UnitOfMeasure),
        minQuantity: z.number().nonnegative().optional(),
        maxQuantity: z.number().nonnegative().optional(),
    })
    .refine(
        (data) =>
            data.minQuantity === undefined ||
            data.maxQuantity === undefined ||
            data.minQuantity <= data.maxQuantity,
        {
            message: "Min quantity must be less than or equal to max quantity",
            path: ["minQuantity"],
        }
    )

export type InventoryItemFormValues = z.infer<
    typeof inventoryItemSchema
>

export type InventoryItem = InventoryItemFormValues & {
    id: number
}
