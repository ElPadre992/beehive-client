import { Supplier, SupplierFormValues, SupplierSchema } from "@/features/inventory/suppliers/supplier.schema";
import { apiFetch } from "@/lib/api";
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
        apiFetch<PaginatedResult<Supplier>>(
            `/inventory/suppliers?${new URLSearchParams(params as any)}`
        ),

    getById: async (id: number) => apiFetch<Supplier>(`/inventory/suppliers/${id}`),

    create: (supplier: SupplierFormValues) => {
        // Optional extra validation on API side
        const parsed = SupplierSchema.safeParse(supplier)
        if (!parsed.success) {
            throw new Error(parsed.error.issues.map(issue => issue.message).join(", "))
        }

        return apiFetch<Supplier>("/inventory/suppliers", {
            method: "POST",
            body: JSON.stringify(parsed.data),
        })
    },

    delete: (id: number) =>
        apiFetch<Supplier>(`/inventory/suppliers/${id}`, {
            method: "DELETE",
        }),
};

// ----------------------------------
// React Query Hooks
// ----------------------------------
export const useCreateSupplier = () => {
    const queryClient = useQueryClient()

    return useMutation<Supplier, Error, SupplierFormValues>({
        mutationFn: SupplierAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers"],
            });
        },
        onError: (error) => console.error("Failed to create a supplier:", error.message),
    })
}

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient()

    return useMutation<Supplier, Error, number>({
        mutationFn: SupplierAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers"],
            });
        },
        onError: (error) => console.error("Failed to delete item:", error.message),
    })
}
