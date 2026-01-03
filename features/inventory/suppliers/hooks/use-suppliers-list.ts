import { SortValues, SupplierFilters } from "@/features/inventory/suppliers/supplier.types";
import { usePaginatedQuery } from "@/hooks/data/use-paginated-query";
import { SupplierAPI } from "../supplier.api";


export function useSuppliersList() {

    return usePaginatedQuery<SupplierFilters, any>({
        queryKey: ["/inventory/suppliers"],
        storageKey: "supplier",
        initialFilters: {
            search: "",
            category: "all",
            sortBy: SortValues.NAME,
            sortOrder: "asc",
        },
        resetPageOn: ["search", "category"],
        queryFn: ({ page, pageSize, filters }) =>
            SupplierAPI.list({
                page,
                pageSize,
                search: filters.search,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                ...(filters.category !== "all"
                    ? { category: filters.category }
                    : {}),
            }),
    });
}