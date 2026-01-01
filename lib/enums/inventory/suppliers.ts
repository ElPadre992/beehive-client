export enum SortValues {
    NAME = "name",
    CONTACT = "sku",
}

export const SortValuesLabel: Record<SortValues, string> = {
    [SortValues.NAME]: "Name",
    [SortValues.CONTACT]: "Contact",
};