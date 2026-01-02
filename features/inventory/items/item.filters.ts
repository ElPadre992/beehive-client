import {
    InventoryCategory,
    InventoryCategoryLabel,
    InventoryFilters,
    SortValues, SortValuesLabel
} from "@/features/inventory/items/item.types";

export type FilterConfig<T> =
    | {
        type: "search";
        key: keyof T;
        placeholder?: string;
    }
    | {
        type: "select";
        key: keyof T;
        options: { value: string; label: string }[];
    }
    | {
        type: "sort";
        key: keyof T;
        options: { value: string; label: string }[];
    }
    | {
        type: "sortOrder";
        key: keyof T;
    };

export const inventoryFilterConfig = [
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
            ...Object.values(InventoryCategory).map((c) => ({
                value: c,
                label: InventoryCategoryLabel[c],
            })),
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
] satisfies FilterConfig<InventoryFilters>[];