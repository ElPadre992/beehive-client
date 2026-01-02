// **********************************
// PRIMARY BUTTON
// **********************************
import { primaryButtonClass } from "@/styles/shared.classes";
import Link from "next/link";

interface PrimaryButtonProps {
    url: string;
    label: string;
}

export function PrimaryButton({ url, label }: PrimaryButtonProps) {
    return (
        <Link href={url} >
            <button className={primaryButtonClass}>
                {label}
            </button>
        </Link>
    );
}