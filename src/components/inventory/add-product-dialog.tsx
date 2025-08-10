
"use client";

import * as React from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Upload, Wand2 } from "lucide-react";

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
import { suggestProductDetails } from "@/ai/flows/suggest-product-details-flow";
import { useToast } from "@/hooks/use-toast";

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
    const { toast } = useToast();
    const [isSuggestingDetails, setIsSuggestingDetails] = React.useState(false);
    const [isSuggestingImage, setIsSuggestingImage] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        imageUrlDesc: { en: "Provide a link, upload, or generate an AI placeholder.", bn: "একটি লিঙ্ক দিন, আপলোড করুন, বা AI দিয়ে একটি ছবি তৈরি করুন।" },
        uploadImage: { en: "Upload", bn: "আপলোড" },
        suggestImage: { en: "Suggest with AI", bn: "AI দিয়ে প্রস্তাব করুন" },
        suggestDetails: { en: "Suggest Details", bn: "AI দিয়ে বিবরণ প্রস্তাব করুন" },
        cancel: { en: "Cancel", bn: "বাতিল" },
        saveProduct: { en: "Save Product", bn: "পণ্য সংরক্ষণ করুন" },
        egFreshApples: { en: "e.g., Fresh Apples", bn: "যেমন, তাজা আপেল" },
        egTajaApel: { en: "e.g., তাজা আপেল", bn: "যেমন, তাজা আপেল" },
        egSku: { en: "e.g., FRT-APL-01", bn: "যেমন, FRT-APL-01" },
        egFruits: { en: "e.g., Fruits", bn: "যেমন, ফল" },
        errorTitle: { en: "Error", bn: "ত্রুটি" },
        detailsSuccess: { en: "Details Suggested", bn: "AI বিস্তারিত পরামর্শ দিয়েছে।" },
        imageSuccess: { en: "Image Suggested", bn: "AI ছবির পরামর্শ দিয়েছে।" },
        fileReadError: { en: "Failed to read file.", bn: "ফাইল পড়তে ব্যর্থ হয়েছে।" },
    };

    const handleSuggestDetails = async () => {
        const productName = form.getValues("name_en");
        if (!productName) return;
        setIsSuggestingDetails(true);
        try {
            const result = await suggestProductDetails({ productName });
            form.setValue("name_bn", result.name_bn);
            form.setValue("sku", result.sku);
            form.setValue("category", result.category);
            toast({ title: t(translations.detailsSuccess) });
        } catch (error) {
            console.error("Error suggesting details:", error);
            toast({ title: t(translations.errorTitle), description: "Failed to suggest details.", variant: "destructive" });
        } finally {
            setIsSuggestingDetails(false);
        }
    };

    const handleSuggestImage = async () => {
        const productName = form.getValues("name_en");
        if (!productName) return;
        setIsSuggestingImage(true);
        try {
            const result = await suggestProductImage({ productName });
            form.setValue("imageUrl", result.imageUrl);
            toast({ title: t(translations.imageSuccess) });
        } catch (error) {
            console.error("Error suggesting image:", error);
            toast({ title: t(translations.errorTitle), description: "Failed to suggest image.", variant: "destructive" });
        } finally {
            setIsSuggestingImage(false);
        }
    };
    
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    form.setValue('imageUrl', result);
                } else {
                    toast({ title: t(translations.errorTitle), description: t(translations.fileReadError), variant: "destructive" });
                }
            };
            reader.onerror = () => {
                toast({ title: t(translations.errorTitle), description: reader.error?.message, variant: "destructive" });
            };
            reader.readAsDataURL(file);
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

    // Reset form when dialog closes
    React.useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t(translations.addNewProduct)}</DialogTitle>
          <DialogDescription>{t(translations.addNewProductDesc)}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-2">
                <FormField
                    control={form.control}
                    name="name_en"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t(translations.englishName)}</FormLabel>
                        <div className="flex items-center gap-2">
                           <FormControl>
                                <Input placeholder={t(translations.egFreshApples)} {...field} />
                            </FormControl>
                            <Button type="button" variant="outline" onClick={handleSuggestDetails} disabled={isSuggestingDetails}>
                               {isSuggestingDetails ? <Loader2 className="animate-spin" /> : <Wand2 />}
                               <span className="ml-2 hidden sm:inline">{t(translations.suggestDetails)}</span>
                            </Button>
                        </div>
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
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                           <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                             <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                                    <Upload />
                                    <span className="ml-2">{t(translations.uploadImage)}</span>
                                </Button>
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                <Button type="button" variant="outline" size="icon" onClick={handleSuggestImage} disabled={isSuggestingImage}>
                                   {isSuggestingImage ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                </Button>
                             </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {field.value && <Image src={field.value.trimEnd()} alt="Product preview" width={64} height={64} className="rounded-md object-cover mt-2" />}
                            <FormDescription>{t(translations.imageUrlDesc)}</FormDescription>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{t(translations.cancel)}</Button>
                    <Button type="submit">{t(translations.saveProduct)}</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
