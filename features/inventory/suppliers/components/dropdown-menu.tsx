"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface SuppliersDropdownMenuProps {
    id: number;
    onDelete: (id: number) => void;
}

export default function SuppliersDropdownMenu({ id, onDelete }: SuppliersDropdownMenuProps) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                        <Link href={`/inventory/suppliers/${id}/details`}>
                            Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/inventory/suppliers/${id}/edit`}>
                            Edit
                        </Link>
                    </DropdownMenuItem>

                    <hr />

                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(id)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}