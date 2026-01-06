"use client";

import { useRealtime } from "@/providers/realtime-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useInventoryItemsRealtime() {
    const { socket } = useRealtime();
    const queryClient = useQueryClient();

    useEffect(() => {
        const invalidate = () => {
            queryClient.invalidateQueries({
                queryKey: ["/inventory/items"],
            });
        };

        socket.on("itemCreated", invalidate);
        socket.on("itemUpdated", invalidate);
        socket.on("itemDeleted", invalidate);

        return () => {
            socket.off("itemCreated", invalidate);
            socket.off("itemUpdated", invalidate);
            socket.off("itemDeleted", invalidate);
        };
    }, [socket, queryClient]);
}
