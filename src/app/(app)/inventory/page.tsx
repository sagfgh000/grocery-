
"use client";

import * as React from "react";
import { ProductTable } from "@/components/inventory/product-table";
import { products as initialProducts } from "@/lib/data";
import { useLanguage } from "@/context/language-context";
import { Product } from "@/lib/types";

export default function InventoryPage() {
    const { t } = useLanguage();
    const [products, setProducts] = React.useState<Product[]>(initialProducts);

    const translations = {
      inventory: { en: "Inventory", bn: "ইনভেন্টরি" },
    };

    const handleProductAdd = (newProduct: Product) => {
      setProducts(prev => [...prev, newProduct]);
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">{t(translations.inventory)}</h2>
            </div>
            <ProductTable data={products} onProductAdd={handleProductAdd} />
        </div>
    )
}
