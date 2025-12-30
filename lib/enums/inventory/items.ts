export enum InventoryCategory {
    RAW_MATERIAL = "RAW_MATERIAL", // metal plates, wood sheets, fabric rolls
    CONSUMABLE = "CONSUMABLE", // cutting tools, abrasives, coolant, ink, filament
    COMPONENT = "COMPONENT", // parts used in assemblies
    FINISHED_GOOD = "FINISHED_GOOD",
    PACKAGING = "PACKAGING", // boxes, tape, labels
    CHEMICAL = "CHEMICAL",
    OTHER = "OTHER"
}

export const InventoryCategoryLabel: Record<InventoryCategory, string> = {
    [InventoryCategory.RAW_MATERIAL]: "Raw Material",
    [InventoryCategory.CONSUMABLE]: "Consumable",
    [InventoryCategory.COMPONENT]: "Component",
    [InventoryCategory.FINISHED_GOOD]: "Finished Good",
    [InventoryCategory.PACKAGING]: "Packaging",
    [InventoryCategory.CHEMICAL]: "Chemical",
    [InventoryCategory.OTHER]: "Other",
};

export enum UnitOfMeasure {
    PCS = "PCS",
    KG = "KG",
    G = "G",
    L = "L",
    ML = "ML",
    M = "M",
    CM = "CM",
    SHEET = "SHEET",
    ROLL = "ROLL",
    SET = "SET",
    BOX = "BOX",
}

export const UnitOfMeasureLabel: Record<UnitOfMeasure, string> = {
    [UnitOfMeasure.BOX]: "Box",
    [UnitOfMeasure.CM]: "cm",
    [UnitOfMeasure.G]: "g",
    [UnitOfMeasure.KG]: "kg",
    [UnitOfMeasure.L]: "l",
    [UnitOfMeasure.M]: "m",
    [UnitOfMeasure.ML]: "ml",
    [UnitOfMeasure.PCS]: "Pcs",
    [UnitOfMeasure.ROLL]: "Roll",
    [UnitOfMeasure.SET]: "Set",
    [UnitOfMeasure.SHEET]: "Sheet",
};

export enum SortValues {
    NAME = "name",
    SKU = "sku",
    CATEGORY = "category",
    QUANTITY = "quantity",
}

export const SortValuesLabel: Record<SortValues, string> = {
    [SortValues.NAME]: "Name",
    [SortValues.SKU]: "SKU",
    [SortValues.CATEGORY]: "Category",
    [SortValues.QUANTITY]: "Quantity",
};