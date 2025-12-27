"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { useEffect } from "react"

export function useSidebarShortcuts() {
    const { toggleSidebar } = useSidebar()

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            // Ignore typing inside inputs
            const target = e.target as HTMLElement
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return
            }

            // Ctrl+B (Windows/Linux) or Cmd+B (macOS)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                e.preventDefault()
                toggleSidebar()
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [toggleSidebar])
}