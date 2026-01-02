import { InventoryItemAPI } from "@/features/inventory/items/item.api";
import { InventoryFilters, SortValues } from "@/features/inventory/items/item.types";
import { usePaginatedQuery } from "@/hooks/data/use-paginated-query";


export function useInventoryList() {

    return usePaginatedQuery<InventoryFilters, any>({
        queryKey: ["/inventory/items"],
        storageKey: "inventory",
        initialFilters: {
            search: "",
            category: "all",
            sortBy: SortValues.NAME,
            sortOrder: "asc",
        },
        resetPageOn: ["search", "category"],
        queryFn: ({ page, pageSize, filters }) =>
            InventoryItemAPI.list({
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