"use client";

import { InventoryAPI, useDeleteInventoryItem } from "@/lib/api/inventory/items";
import { InventoryCategoryLabel, UnitOfMeasureLabel } from "@/lib/enums/inventory/items";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function InventoryItems() {
    const { data: itemsList, isLoading, error } = useQuery({
        queryKey: ["inventory/items"],
        queryFn: InventoryAPI.list,
    });

    const deleteMutation = useDeleteInventoryItem();

    if (isLoading) { return <p>Loading inventory items...</p>; }
    if (error) { return <p>Error: {(error as Error).message}</p>; }

    return (
        <div className="w-full mx-auto">
            {/* New Item */}
            <div className="p-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Items</h1>
                    <Link href="/inventory/items/new">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow">
                            New Item
                        </button>
                    </Link>
                </div>
            </div>

            {/* Items Table */}
            <table className="min-w-full text-left text-sm text-gray-700 border rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-900 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Stock Keeping Unit</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Quantity</th>
                        <th className="px-6 py-3">Unit</th>
                        <th className="px-6 py-3">Min Quantity</th>
                        <th className="px-6 py-3">Max Quantity</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsList?.map((item) => (
                        <tr key={item.id} className="border-t hover:bg-gray-50">
                            <td className="px-6 py-3">{item.id}</td>
                            <td className="px-6 py-3">{item.sku}</td>
                            <td className="px-6 py-3">{item.name}</td>
                            <td className="px-6 py-3">{InventoryCategoryLabel[item.category]}</td>
                            <td className="px-6 py-3">{item.description}</td>
                            <td className="px-6 py-3">{item.quantity}</td>
                            <td className="px-6 py-3">{UnitOfMeasureLabel[item.unit]}</td>
                            <td className="px-6 py-3">{item.minQuantity}</td>
                            <td className="px-6 py-3">{item.maxQuantity}</td>
                            <td className="px-6 py-3">
                                <button
                                    onClick={() => deleteMutation.mutate(item.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}