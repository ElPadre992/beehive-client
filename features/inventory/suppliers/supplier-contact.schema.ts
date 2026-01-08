import { z } from "zod";

const SupplierContactSchema = z
    .object({
        id: z.number(),
        name: z.string().min(1, "Contact name is required"),
        email: z.email("Valid Email address is required"),
        phone: z
            .string()
            .min(3)
            .max(30)
            .regex(/^[0-9+\-\/\s]+$/, "Invalid phone characters")
            .refine(val => /\d/.test(val), {
                message: "Phone number must contain at least one digit",
            })
            .optional(),
        notes: z.string().optional(),
        isPrimary: z.boolean().optional()
    })

export type SupplierContactFormValues = z.infer<
    typeof SupplierContactSchema
>

export const SupplierContactInput = SupplierContactSchema.omit({ id: true })

export const SupplierContactApi = SupplierContactSchema;