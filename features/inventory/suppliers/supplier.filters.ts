import { FilterConfig } from "@/features/shared/filter-config";
import { SortValues, SortValuesLabel, SupplierFilters } from "./supplier.types";

export const supplierFilterConfig = [
    {
        type: "search",
        key: "search",
        placeholder: "Search items...",
    },
    {
        type: "select",
        key: "category",
        options: [
            { value: "all", label: "All Categories" },
        ],
    },
    {
        type: "sort",
        key: "sortBy",
        options: Object.values(SortValues).map((v) => ({
            value: v,
            label: SortValuesLabel[v],
        })),
    },
    {
        type: "sortOrder",
        key: "sortOrder",
    },
] satisfies FilterConfig<SupplierFilters>[];