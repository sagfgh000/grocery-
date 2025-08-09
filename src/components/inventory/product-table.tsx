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

interface ProductTableProps {
  data: Product[];
}

export function ProductTable({ data }: ProductTableProps) {
  const [filteredData, setFilteredData] = React.useState(data);
  const { language, t } = useLanguage();

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
  
  const stockLabels = {
    en: {
      inStock: "In Stock",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
    },
    bn: {
      inStock: "স্টকে আছে",
      lowStock: "কম স্টক",
      outOfStock: "স্টক আউট",
    }
  }

  const getStockLabel = (stock: number, threshold: number) => {
    if (stock === 0) return t(stockLabels).outOfStock;
    if (stock < threshold) return t(stockLabels).lowStock;
    return t(stockLabels).inStock;
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
            placeholder="পণ্য খুঁজুন..."
            className="pl-8"
            onChange={handleSearch}
          />
        </div>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> পণ্য যোগ করুন
        </Button>
      </div>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] sticky left-0 bg-card">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Profit/Unit</TableHead>
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
                  <TableCell className="text-right whitespace-nowrap">{formatCurrency(product.selling_price - product.buying_price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
