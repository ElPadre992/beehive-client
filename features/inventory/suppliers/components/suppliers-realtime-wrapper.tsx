"use client";

import { useSuppliersRealtime } from "../hooks/use-suppliers-realtime";

export function SuppliersRealtimeWrapper() {
    useSuppliersRealtime();
    return null; // no UI needed
}