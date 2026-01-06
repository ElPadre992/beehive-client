import { InventoryItem, inventoryItemCreateSchema, InventoryItemCreateValues, inventoryItemUpdateSchema, InventoryItemUpdateValues } from "@/features/inventory/items/item.schema";
import { apiFetch } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export interface ListInventoryItemParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    category?: string;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

// ----------------------------------
// API Functions
// ----------------------------------
export const InventoryItemAPI = {
    list: (params: ListInventoryItemParams) =>
        apiFetch<PaginatedResult<InventoryItem>>(
            `/inventory/items?${new URLSearchParams(params as any)}`
        ),

    getById: async (id: number) => apiFetch<InventoryItem>(`/inventory/items/${id}`),

    create: async (item: InventoryItemCreateValues) => {
        // Optional extra validation on API side
        const parsed = inventoryItemCreateSchema.safeParse(item)
        if (!parsed.success) {
            throw new Error(parsed.error.issues.map(issue => issue.message).join(", "))
        }

        return apiFetch<InventoryItem>("/inventory/items", {
            method: "POST",
            body: JSON.stringify(parsed.data),
        })
    },

    update: async (id: number, item: InventoryItemUpdateValues) => {
        const parsed = inventoryItemUpdateSchema.safeParse(item)
        if (!parsed.success) {
            throw new Error(
                parsed.error.issues.map(issue => issue.message).join(", ")
            )
        }

        return apiFetch<InventoryItem>(`/inventory/items/${id}`, {
            method: "PATCH",
            body: JSON.stringify(parsed.data),
        })
    },

    delete: (id: number) => apiFetch<InventoryItem>(`/inventory/items/${id}`, { method: "DELETE", }),
}

// ----------------------------------
// React Query Hooks
// ----------------------------------
export const useCreateInventoryItem = () => {
    return useMutation<InventoryItem, Error, InventoryItemCreateValues>({
        mutationFn: InventoryItemAPI.create,
        onError: (error) => console.error("Failed to create item:", error.message),
    })
}

type InventoryItemPayload = {
    id: number
    data: InventoryItemUpdateValues
}

export const useUpdateInventoryItem = () => {
    return useMutation<InventoryItem, Error, InventoryItemPayload>({
        mutationFn: ({ id, data }) =>
            InventoryItemAPI.update(id, data),

        onError: (error) => console.error("Failed to update item:", error.message),
    })
}

export const useDeleteInventoryItem = () => {
    return useMutation<InventoryItem, Error, number>({
        mutationFn: InventoryItemAPI.delete,
        onError: (error) => console.error("Failed to delete item:", error.message),
    })
}
