// **********************************
// SEARCH FIELD
// **********************************

import { useEffect, useRef, useState } from "react";

export function IsTypingInInput(target: EventTarget | null) {
    return (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
    );
}

interface SearchFieldProps {
    onSearch: (value: string) => void;
    placeholder?: string;
}

export function SearchField({ onSearch, placeholder }: SearchFieldProps) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    /* Debounced search */
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(input);
        }, 400);

        return () => clearTimeout(handler);
    }, [input, onSearch]);

    /* "/" to focus search */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            if (e.key === "Escape") {
                if (document.activeElement === inputRef.current) {
                    setInput("");               // clear input
                    onSearch("");               // propagate empty search
                    inputRef.current?.blur();   // remove focus
                }
            }

            // Don't steal focus while typing elsewhere
            if (IsTypingInInput(target)) return;



            if ((e.key === "/" && !e.ctrlKey) || (e.ctrlKey && e.key.toLowerCase() === "k")) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full"
            />

            {/* Keyboard hint */}
            <kbd
                className="absolute right-2 top-1/2 -translate-y-1/2
                           text-xs border rounded px-1.5 py-0.5
                           text-muted-foreground bg-background"
            >
                /
            </kbd>
        </div>
    );
}