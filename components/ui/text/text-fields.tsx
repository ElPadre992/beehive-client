import { subheaderClass } from "@/styles/shared.classes";

export function HeaderField({ label }: { label: string }) {
    return (
        <>
            <h1 className="text-3xl font-bold">{label}</h1>
        </>
    )
}

export function SubheaderField({ label }: { label: string }) {
    return (
        <>
            <h2 className={subheaderClass}>{label}</h2>
            <hr className="mt-2 mb-4" />
        </>
    )
}