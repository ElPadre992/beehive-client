"use client";

import { useRealtime } from "@/providers/realtime-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSuppliersRealtime() {
    const { socket } = useRealtime();
    const queryClient = useQueryClient();

    useEffect(() => {
        console.log("Socket connected:", socket.connected);

        const onCreated = () => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers"],
            });
        };

        const onUpdated = (supplier: { id: number }) => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers"],
            });

            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers", supplier.id],
            });
        };

        const onDeleted = (id: number) => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/suppliers"],
            });

            queryClient.removeQueries({
                queryKey: ["/inventory/suppliers", id],
            });
        };

        socket.on("supplierCreated", onCreated);
        socket.on("supplierUpdated", onUpdated);
        socket.on("supplierDeleted", onDeleted);

        return () => {
            socket.off("supplierCreated", onCreated);
            socket.off("supplierUpdated", onUpdated);
            socket.off("supplierDeleted", onDeleted);
        };
    }, [socket, queryClient]);
}
