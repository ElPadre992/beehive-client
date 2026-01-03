"use client";

import { useRealtime } from "@/providers/realtime-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSuppliersRealtime() {
    const { socket } = useRealtime();
    const queryClient = useQueryClient();

    useEffect(() => {
        const invalidate = () => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers"],
            });
        };

        socket.on("supplierCreated", invalidate);
        socket.on("supplierDeleted", invalidate);

        return () => {
            socket.off("supplierCreated", invalidate);
            socket.off("supplierDeleted", invalidate);
        };
    }, [socket, queryClient]);
}
