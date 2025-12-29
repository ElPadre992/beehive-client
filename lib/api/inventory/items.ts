import { apiFetch } from "@/lib/api";
import { InventoryItem, InventoryItemFormValues, inventoryItemSchema } from "@/lib/schemas/inventory/inventory-item.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export interface ListInventoryParams {
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
export const InventoryAPI = {
    list: (params: ListInventoryParams) =>
        apiFetch<PaginatedResult<InventoryItem>>(
            `/inventory/items?${new URLSearchParams(params as any)}`
        ),

    create: async (item: InventoryItemFormValues) => {
        // Optional extra validation on API side
        const parsed = inventoryItemSchema.safeParse(item)
        if (!parsed.success) {
            throw new Error(parsed.error.issues.map(issue => issue.message).join(", "))
        }

        return apiFetch<InventoryItem>("/inventory/items", {
            method: "POST",
            body: JSON.stringify(parsed.data),
        })
    },

    delete: (id: number) =>
        apiFetch<InventoryItem>(`/inventory/items/${id}`, {
            method: "DELETE",
        }),
}

// ----------------------------------
// React Query Hooks
// ----------------------------------
export const useCreateInventoryItem = () => {
    const queryClient = useQueryClient()

    return useMutation<InventoryItem, Error, InventoryItemFormValues>({
        mutationFn: InventoryAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["inventory/items"],
            });
        },
        onError: (error) => console.error("Failed to create item:", error.message),
    })
}

export const useDeleteInventoryItem = () => {
    const queryClient = useQueryClient()

    return useMutation<InventoryItem, Error, number>({
        mutationFn: InventoryAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["inventory/items"],
            });
        },
        onError: (error) => console.error("Failed to delete item:", error.message),
    })
}
