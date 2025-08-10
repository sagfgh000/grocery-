
"use client";

import * as React from "react";
import { ProductTable } from "@/components/inventory/product-table";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";

export default function InventoryPage() {
    const { t } = useLanguage();
    const { products, addProduct } = useData();

    const translations = {
      inventory: { en: "Inventory", bn: "ইনভেন্টরি" },
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">{t(translations.inventory)}</h2>
            </div>
            <ProductTable data={products} onProductAdd={addProduct} />
        </div>
    )
}
