import { compactButtonClass, inputClass } from "@/styles/shared.classes";
import { SearchField } from "./form/search-field";

// FilterBar.tsx
type FilterConfig<T> =
    | { type: "search"; key: keyof T; placeholder?: string }
    | { type: "select"; key: keyof T; options: { value: string; label: string }[] }
    | { type: "sort"; key: keyof T; options: { value: string; label: string }[] }
    | { type: "sortOrder"; key: keyof T };

interface FilterBarProps<T> {
    filters: T;
    onChange: (key: keyof T, value: string) => void;
    config: FilterConfig<T>[];
}

export function FilterBar<T extends Record<string, any>>({
    filters,
    onChange,
    config,
}: FilterBarProps<T>) {
    return (
        <div className="flex items-center gap-2">
            {config.map((item, i) => {
                switch (item.type) {
                    case "search":
                        return (
                            <SearchField
                                key={i}
                                placeholder={item.placeholder}
                                onSearch={(v) => onChange(item.key, v)}
                            />
                        );

                    case "select":
                        return (
                            <select
                                key={i}
                                value={filters[item.key]}
                                onChange={(e) => onChange(item.key, e.target.value)}
                                className={inputClass}
                            >
                                {item.options.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        );

                    case "sort":
                        return (
                            <select
                                key={i}
                                value={filters[item.key]}
                                onChange={(e) => onChange(item.key, e.target.value)}
                                className={inputClass}
                            >
                                {item.options.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        );

                    case "sortOrder":
                        return (
                            <button
                                key={i}
                                onClick={() =>
                                    onChange(
                                        item.key,
                                        filters[item.key] === "asc" ? "desc" : "asc"
                                    )
                                }
                                className={compactButtonClass}
                            >
                                {filters[item.key] === "asc" ? "↑ Asc" : "↓ Desc"}
                            </button>
                        );
                }
            })}
        </div>
    );
}