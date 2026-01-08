"use client";

import { useRealtime } from "@/providers/realtime-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useInventoryItemsRealtime() {
    const { socket } = useRealtime();
    const queryClient = useQueryClient();

    useEffect(() => {
        console.log("Socket connected:", socket.connected);

        const onCreated = () => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/items"],
            });
        };

        const onUpdated = (item: { id: number }) => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/items"],
            });

            queryClient.invalidateQueries({
                queryKey: ["/inventory/items", item.id],
            });
        };

        const onDeleted = (id: number) => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/items"],
            });

            queryClient.removeQueries({
                queryKey: ["/inventory/items", id],
            });
        };

        socket.on("itemCreated", onCreated);
        socket.on("itemUpdated", onUpdated);
        socket.on("itemDeleted", onDeleted);

        return () => {
            socket.off("itemCreated", onCreated);
            socket.off("itemUpdated", onUpdated);
            socket.off("itemDeleted", onDeleted);
        };
    }, [socket, queryClient]);
}
