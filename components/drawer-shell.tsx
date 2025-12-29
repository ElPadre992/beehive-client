"use client";

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface DrawerShellProps {
    children: ReactNode
    header?: ReactNode
    footer?: ReactNode
    title?: string
}

export default function DrawerShell({ children, header, footer, title }: DrawerShellProps) {
    const router = useRouter()

    return (
        <>
            {/* Darkened backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => router.back()}
            />

            {/* Drawer panel */}
            <div className='absolute z-50 top-0 right-0 h-full w-150 bg-white shadow-xl flex flex-col'>

                {/* Header */}
                <div className="sticky top-0 bg-muted-foreground border-b px-8 py-6 text-gray-200">
                    {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
                    {header}
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto text-sm">{children}</div>

                {/* Footer */}
                <div className='sticky bottom-0 bg-muted shadow-xl border-t px-8 py-4 flex justify-end gap-6'>
                    {footer}
                </div>
            </div>
        </>
    )
}