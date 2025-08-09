
"use client";

import * as React from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Wand2 } from "lucide-react";

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
    FormDescription,
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
import { useLanguage } from "@/context/language-context";
import { suggestProductImage } from "@/ai/flows/suggest-product-image-flow";

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
    imageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  });

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onProductAdd: (product: Product) => void;
}

export function AddProductDialog({ isOpen, onOpenChange, onProductAdd }: AddProductDialogProps) {
    const { t } = useLanguage();
    const [isSuggestingImage, setIsSuggestingImage] = React.useState(false);
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
            low_stock_threshold: 10,
            imageUrl: ""
        },
    });

    const translations = {
        addNewProduct: { en: "Add New Product", bn: "নতুন পণ্য যোগ করুন" },
        addNewProductDesc: { en: "Fill in the details of the new product below.", bn: "নিচে নতুন পণ্যের বিবরণ পূরণ করুন।" },
        englishName: { en: "English Name", bn: "ইংরেজি নাম" },
        bengaliName: { en: "Bengali Name", bn: "বাংলা নাম" },
        sku: { en: "SKU", bn: "এসเคยু" },
        unit: { en: "Unit", bn: "একক" },
        selectUnit: { en: "Select a unit", bn: "একটি একক নির্বাচন করুন" },
        pcs: { en: "Pieces (pcs)", bn: "পিস (pcs)" },
        kg: { en: "Kilogram (kg)", bn: "কিলোগ্রাম (kg)" },
        g: { en: "Gram (g)", bn: "গ্রাম (g)" },
        category: { en: "Category", bn: "বিভাগ" },
        buyingPrice: { en: "Buying Price (BDT)", bn: "ক্রয় মূল্য (BDT)" },
        sellingPrice: { en: "Selling Price (BDT)", bn: "বিক্রয় মূল্য (BDT)" },
        stockQuantity: { en: "Stock Quantity", bn: "স্টক পরিমাণ" },
        lowStockThreshold: { en: "Low Stock Threshold", bn: "নিম্ন স্টক থ্রেশহোল্ড" },
        imageUrl: { en: "Image URL", bn: "ছবির URL" },
        imageUrlDesc: { en: "Provide a link to the product image.", bn: "পণ্যের ছবির একটি লিঙ্ক দিন।" },
        suggestImage: { en: "Suggest with AI", bn: "AI দিয়ে প্রস্তাব করুন" },
        cancel: { en: "Cancel", bn: "বাতিল" },
        saveProduct: { en: "Save Product", bn: "পণ্য সংরক্ষণ করুন" },
        egFreshApples: { en: "e.g., Fresh Apples", bn: "যেমন, তাজা আপেল" },
        egTajaApel: { en: "e.g., তাজা আপেল", bn: "যেমন, তাজা আপেল" },
        egSku: { en: "e.g., FRT-APL-01", bn: "যেমন, FRT-APL-01" },
        egFruits: { en: "e.g., Fruits", bn: "যেমন, ফল" },
    };

    const handleSuggestImage = async () => {
        const productName = form.getValues("name_en");
        if (!productName) return;
        setIsSuggestingImage(true);
        try {
            const result = await suggestProductImage({ productName });
            form.setValue("imageUrl", result.imageUrl);
        } catch (error) {
            console.error("Error suggesting image:", error);
        } finally {
            setIsSuggestingImage(false);
        }
    };
    
    const onSubmit = (data: ProductFormValues) => {
        const newProduct: Product = {
            id: `prod_${Date.now()}`,
            ...data,
            imageUrl: data.imageUrl || `https://placehold.co/300x300.png?text=${data.name_en.charAt(0)}`
        };
        onProductAdd(newProduct);
        onOpenChange(false);
        form.reset();
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t(translations.addNewProduct)}</DialogTitle>
          <DialogDescription>{t(translations.addNewProductDesc)}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="name_en"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t(translations.englishName)}</FormLabel>
                        <FormControl>
                            <Input placeholder={t(translations.egFreshApples)} {...field} />
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
                        <FormLabel>{t(translations.bengaliName)}</FormLabel>
                        <FormControl>
                            <Input placeholder={t(translations.egTajaApel)} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t(translations.imageUrl)}</FormLabel>
                        <div className="flex items-center gap-2">
                           <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <Button type="button" variant="outline" size="icon" onClick={handleSuggestImage} disabled={isSuggestingImage}>
                               {isSuggestingImage ? <Loader2 className="animate-spin" /> : <Wand2 />}
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            {field.value && <Image src={field.value} alt="Product preview" width={64} height={64} className="rounded-md object-cover mt-2" />}
                            <FormDescription>{t(translations.imageUrlDesc)}</FormDescription>
                        </div>
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
                            <FormLabel>{t(translations.sku)}</FormLabel>
                            <FormControl>
                                <Input placeholder={t(translations.egSku)} {...field} />
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
                            <FormLabel>{t(translations.unit)}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={t(translations.selectUnit)} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="pcs">{t(translations.pcs)}</SelectItem>
                                <SelectItem value="kg">{t(translations.kg)}</SelectItem>
                                <SelectItem value="g">{t(translations.g)}</SelectItem>
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
                        <FormLabel>{t(translations.category)}</FormLabel>
                        <FormControl>
                            <Input placeholder={t(translations.egFruits)} {...field} />
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
                            <FormLabel>{t(translations.buyingPrice)}</FormLabel>
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
                            <FormLabel>{t(translations.sellingPrice)}</FormLabel>
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
                            <FormLabel>{t(translations.stockQuantity)}</FormLabel>
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
                            <FormLabel>{t(translations.lowStockThreshold)}</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{t(translations.cancel)}</Button>
                    <Button type="submit">{t(translations.saveProduct)}</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
