
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { type Product } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { AddProductDialog } from "./add-product-dialog";

interface ProductTableProps {
  data: Product[];
  onProductAdd: (product: Product) => void;
}

export function ProductTable({ data, onProductAdd }: ProductTableProps) {
  const [filteredData, setFilteredData] = React.useState(data);
  const { language, t } = useLanguage();
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const translations = {
    searchPlaceholder: { en: "Search products...", bn: "পণ্য খুঁজুন..." },
    addProduct: { en: "Add Product", bn: "পণ্য যোগ করুন" },
    image: { en: "Image", bn: "ছবি" },
    productName: { en: "Product Name", bn: "পণ্যের নাম" },
    category: { en: "Category", bn: "বিভাগ" },
    stock: { en: "Stock", bn: "স্টক" },
    price: { en: "Price", bn: "মূল্য" },
    profitPerUnit: { en: "Profit/Unit", bn: "লাভ/একক" },
    inStock: { en: "In Stock", bn: "স্টকে আছে" },
    lowStock: { en: "Low Stock", bn: "কম স্টক" },
    outOfStock: { en: "Out of Stock", bn: "স্টক আউট" },
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = data.filter(
      (product) =>
        product.name_en.toLowerCase().includes(searchTerm) ||
        product.name_bn.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const getStockBadgeVariant = (stock: number, threshold: number) => {
    if (stock === 0) return "destructive";
    if (stock < threshold) return "secondary";
    return "default";
  };

  const getStockLabel = (stock: number, threshold: number) => {
    if (stock === 0) return t(translations.outOfStock);
    if (stock < threshold) return t(translations.lowStock);
    return t(translations.inStock);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t(translations.searchPlaceholder)}
            className="pl-8"
            onChange={handleSearch}
          />
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t(translations.addProduct)}
        </Button>
      </div>

      <AddProductDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onProductAdd={onProductAdd}
      />

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] sticky left-0 bg-card">{t(translations.image)}</TableHead>
                <TableHead>{t(translations.productName)}</TableHead>
                <TableHead>{t(translations.category)}</TableHead>
                <TableHead>{t(translations.stock)}</TableHead>
                <TableHead className="text-right">{t(translations.price)}</TableHead>
                <TableHead className="text-right">{t(translations.profitPerUnit)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="sticky left-0 bg-card">
                    <Image
                      src={product.imageUrl || "https://placehold.co/64x64.png"}
                      alt={product.name_en}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    <div>{language === 'bn' ? product.name_bn : product.name_en}</div>
                    <div className="text-sm text-muted-foreground">{product.sku}</div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                      <Badge variant={getStockBadgeVariant(product.stock_quantity, product.low_stock_threshold)}>
                          {product.stock_quantity} {product.unit}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                          {getStockLabel(product.stock_quantity, product.low_stock_threshold)}
                      </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatCurrency(product.selling_price)}</TableCell>
                  <TableCell className="text-right text-green-600 whitespace-nowrap">{formatCurrency(product.selling_price - product.buying_price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
