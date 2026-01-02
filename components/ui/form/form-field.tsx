// **********************************
// FORM FIELD
// **********************************

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

export function FormField({ label, required, error, children }: FormFieldProps) {
    return (
        <div>
            <div className="flex items-start mt-4">
                <label className="w-35 font-medium mt-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <div className="flex-1">{children}</div>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
    );
}