// usePaginatedQuery.ts
import { useLocalStorageState } from "@/hooks/storage/use-local-storage-state";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export interface ApiError {
    message: string;
    statusCode?: number;
    details?: unknown;
}

interface UsePaginatedQueryOptions<TFilters, TData> {
    queryKey: QueryKey;
    storageKey: string;
    initialFilters: TFilters;
    resetPageOn?: (keyof TFilters)[];
    queryFn: (params: {
        page: number;
        pageSize: number;
        filters: TFilters;
    }) => Promise<TData>;
}

export function usePaginatedQuery<TFilters extends Record<string, any>, TData>({
    queryKey,
    storageKey,
    initialFilters,
    resetPageOn = [],
    queryFn,
}: UsePaginatedQueryOptions<TFilters, TData>) {
    const [page, setPage] = useLocalStorageState(`${storageKey}:page`, 1);
    const [pageSize, setPageSize] = useLocalStorageState(
        `${storageKey}:pageSize`,
        20
    );

    const [filters, setFilters] = useState<TFilters>(initialFilters);

    const setFilter = useCallback(
        <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
            if (resetPageOn.includes(key) && value.trim() !== "") setPage(1);
        },
        [resetPageOn, setPage]
    );

    const query = useQuery<TData, ApiError>({
        queryKey: [...queryKey, page, pageSize, filters],
        queryFn: () => queryFn({ page, pageSize, filters }),
        placeholderData: (prev) => prev,
    });

    return {
        page,
        setPage,
        pageSize,
        setPageSize,
        filters,
        setFilter,
        setFilters,
        ...query,
    };
}