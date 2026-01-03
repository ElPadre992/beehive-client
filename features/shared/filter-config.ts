export type FilterConfig<T> =
    | {
        type: "search";
        key: keyof T;
        placeholder?: string;
    }
    | {
        type: "select";
        key: keyof T;
        options: { value: string; label: string }[];
    }
    | {
        type: "sort";
        key: keyof T;
        options: { value: string; label: string }[];
    }
    | {
        type: "sortOrder";
        key: keyof T;
    };