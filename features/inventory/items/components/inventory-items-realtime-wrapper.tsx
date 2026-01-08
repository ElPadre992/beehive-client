"use client";

import { useInventoryItemsRealtime } from "../hooks/use-inventory-items-realtime";

export function InventoryItemRealtimeWrapper() {
    useInventoryItemsRealtime();
    return null; // no UI needed
}