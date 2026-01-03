"use client";

import { getSocket } from "@/lib/socket";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Socket } from "socket.io-client";

type RealtimeContextValue = {
    socket: Socket;
    connected: boolean;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [connected, setConnected] = useState(false);

    // Create (or retrieve) the singleton socket ONCE
    const socket = useMemo(() => getSocket(), []);

    useEffect(() => {
        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            // socket.disconnect(); // On Vercel (and in dev with Fast Refresh), layouts may remount.
        };
    }, [socket]);

    return (
        <RealtimeContext.Provider value={{ socket, connected }}>
            {children}
        </RealtimeContext.Provider>
    );
}

export function useRealtime() {
    const ctx = useContext(RealtimeContext);
    if (!ctx) {
        throw new Error("useRealtime must be used inside RealtimeProvider");
    }
    return ctx;
}
