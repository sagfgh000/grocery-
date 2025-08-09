
"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/types";

const productSchema = z.object({
    name_en: z.string().min(1, "English name is required"),
    name_bn: z.string().min(1, "Bengali name is required"),
    sku: z.string().min(1, "SKU is required"),
    unit: z.enum(['kg', 'g', 'pcs']),
    category: z.string().min(1, "Category is required"),
    stock_quantity: z.coerce.number().min(0, "Stock can't be negative"),
    selling_price: z.coerce.number().min(0, "Selling price can't be negative"),
    buying_price: z.coerce.number().min(0, "Buying price can't be negative"),
    low_stock_threshold: z.coerce.number().min(0, "Threshold can't be negative"),
  });

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onProductAdd: (product: Product) => void;
}

export function AddProductDialog({ isOpen, onOpenChange, onProductAdd }: AddProductDialogProps) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name_en: "",
            name_bn: "",
            sku: "",
            category: "",
            unit: 'pcs',
            stock_quantity: 0,
            selling_price: 0,
            buying_price: 0,
            low_stock_threshold: 10
        },
    });

    const onSubmit = (data: ProductFormValues) => {
        const newProduct: Product = {
            id: `prod_${Date.now()}`,
            ...data,
            imageUrl: `https://placehold.co/300x300.png?text=${data.name_en.charAt(0)}`
        };
        onProductAdd(newProduct);
        onOpenChange(false);
        form.reset();
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details of the new product below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="name_en"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>English Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Fresh Apples" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name_bn"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bengali Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., তাজা আপেল" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., FRT-APL-01" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="g">Gram (g)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Fruits" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="buying_price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Buying Price (BDT)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="selling_price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Selling Price (BDT)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="stock_quantity"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="low_stock_threshold"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Low Stock Threshold</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Save Product</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
