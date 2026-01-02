// **********************************
// SELECT FIELD
// **********************************

import { FormField } from "./form-field";

interface SelectFieldProps {
    label: string;
    options: Record<string, string>;
    required?: boolean;
    error?: string;
    register: any;
    name: string;
}

export function SelectField({ label, options, required, error, register, name }: SelectFieldProps) {
    return (
        <FormField label={label} required={required} error={error}>
            <select className="w-full border px-3 py-2 rounded-md" {...register(name)}>
                {Object.entries(options).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </FormField>
    );
}