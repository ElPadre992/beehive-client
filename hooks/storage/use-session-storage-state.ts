import { useEffect, useState } from "react";

/**
 * useSessionStorageState hook
 * Stores state in sessionStorage (cleared when the tab is closed)
 */
export function useSessionStorageState<T>(key: string, defaultValue: T) {
    const [state, setState] = useState<T>(() => {
        if (typeof window !== "undefined") {
            const stored = sessionStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        }
        return defaultValue;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem(key, JSON.stringify(state));
        }
    }, [key, state]);

    return [state, setState] as const;
}