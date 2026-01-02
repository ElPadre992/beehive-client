import { IsTypingInInput } from "@/components/ui/form/search-field";
import { useEffect } from "react";

interface PaginationShortcutsProps {
    page: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (newPage: number) => void;
}

export function usePaginationShortcuts({ page, totalPages, isLoading, onPageChange }: PaginationShortcutsProps) {
    useEffect(() => {
        if (isLoading) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            if (isLoading) return;
            if (IsTypingInInput(target)) return;

            switch (e.key) {
                case 'ArrowRight':
                    if (page < totalPages) onPageChange(page + 1);
                    break;
                case 'ArrowLeft':
                    if (page > 1) onPageChange(page - 1);
                    break;
                case 'ArrowUp':
                    onPageChange(1);
                    break;
                case 'ArrowDown':
                    onPageChange(totalPages);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [page, totalPages, isLoading, onPageChange]);
}