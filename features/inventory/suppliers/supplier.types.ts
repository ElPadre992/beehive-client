export enum SortValues {
    NAME = "name",
}

export const SortValuesLabel: Record<SortValues, string> = {
    [SortValues.NAME]: "Name",
};

export interface SupplierFilters {
    search: string;
    category: string | "all";
    sortBy: SortValues;
    sortOrder: "asc" | "desc";
}