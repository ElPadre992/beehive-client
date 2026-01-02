import { apiFetch } from "@/lib/api";
import { InventorySupplier, SupplierFormValues, inventorySupplierSchema } from "@/lib/schemas/inventory/supplier.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ListInventoryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export const SupplierAPI = {
    list: (params: ListInventoryParams) =>
        apiFetch<PaginatedResult<InventorySupplier>>(
            `/inventory/suppliers?${new URLSearchParams(params as any)}`
        ),


    create: (supplier: SupplierFormValues) => {
        // Optional extra validation on API side
        const parsed = inventorySupplierSchema.safeParse(supplier)
        if (!parsed.success) {
            throw new Error(parsed.error.issues.map(issue => issue.message).join(", "))
        }

        return apiFetch<InventorySupplier>("/inventory/suppliers", {
            method: "POST",
            body: JSON.stringify(parsed.data),
        })
    },

    delete: (id: number) =>
        apiFetch<InventorySupplier>(`/inventory/suppliers/${id}`, {
            method: "DELETE",
        }),
};

// ----------------------------------
// React Query Hooks
// ----------------------------------
export const useCreateInventorySupplier = () => {
    const queryClient = useQueryClient()

    return useMutation<InventorySupplier, Error, SupplierFormValues>({
        mutationFn: SupplierAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers"],
            });
        },
        onError: (error) => console.error("Failed to create a supplier:", error.message),
    })
}

export const useDeleteInventorySupplier = () => {
    const queryClient = useQueryClient()

    return useMutation<InventorySupplier, Error, number>({
        mutationFn: SupplierAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers"],
            });
        },
        onError: (error) => console.error("Failed to delete item:", error.message),
    })
}
