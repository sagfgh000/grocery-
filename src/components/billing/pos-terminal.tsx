
"use client";

import * as React from "react";
import Image from "next/image";
import { useData } from "@/context/data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, X, Search, Pencil } from "lucide-react";
import { type CartItem, type Product, type Order } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { Receipt } from "./receipt";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Label } from "../ui/label";


export function PosTerminal() {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { products, addOrder } = useData();
  const [isReceiptOpen, setReceiptOpen] = React.useState(false);
  const [lastOrder, setLastOrder] = React.useState<Order | null>(null);
  const [amountPaid, setAmountPaid] = React.useState(0);
  const [isCheckoutOpen, setCheckoutOpen] = React.useState(false);
  const [editingQuantity, setEditingQuantity] = React.useState<{item: CartItem, input: string} | null>(null);

  const isMobile = useIsMobile();

  const translations = {
    products: { en: "Products", bn: "পণ্য" },
    searchPlaceholder: { en: "Search products...", bn: "পণ্য খুঁজুন..." },
    currentOrder: { en: "Current Order", bn: "বর্তমান অর্ডার" },
    cartEmpty: { en: "Your cart is empty.", bn: "আপনার কার্ট খালি।" },
    profit: { en: "Profit", bn: "লাভ" },
    subtotal: { en: "Subtotal", bn: "উপমোট" },
    tax: { en: "Tax (5%)", bn: "কর (৫%)" },
    estimatedProfit: { en: "Estimated Profit", bn: "আনুমানিক লাভ" },
    total: { en: "Total", bn: "মোট" },
    checkout: { en: "Checkout", bn: "চেকআউট" },
    receipt: { en: "Receipt", bn: "রসিদ" },
    cartEmptyTitle: { en: "Cart is empty", bn: "কার্ট খালি" },
    cartEmptyDesc: { en: "Please add products to the cart before checkout.", bn: "চেকআউটের আগে দয়া করে কার্টে পণ্য যোগ করুন।" },
    addedToCart: { en: (product: string) => `${product} added to cart.`, bn: (product: string) => `${product} কার্টে যোগ করা হয়েছে।` },
    completeOrder: { en: "Complete Order", bn: "অর্ডার সম্পন্ন করুন" },
    amountPaid: { en: "Amount Paid", bn: "প্রদত্ত পরিমাণ" },
    amountDue: { en: "Amount Due", bn: "বকেয়া পরিমাণ" },
    paymentMethod: { en: "Payment Method", bn: "পেমেন্ট পদ্ধতি" },
    quantity: { en: "Quantity", bn: "পরিমাণ" },
    updateQuantity: { en: "Update Quantity", bn: "পরিমাণ আপডেট করুন" },
    cancel: { en: "Cancel", bn: "বাতিল" },
    update: { en: "Update", bn: "আপডেট" },
    enterQuantityFor: { en: (name: string) => `Enter quantity for ${name}`, bn: (name: string) => `${name} এর পরিমাণ লিখুন` },
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_bn.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const cartSubtotal = cart.reduce((total, item) => total + item.subtotal, 0);
  const taxRate = 0.05; // 5%
  const tax = cartSubtotal * taxRate;
  const total = cartSubtotal + tax;
  const totalProfit = cart.reduce((total, item) => total + item.profit, 0);
  
  React.useEffect(() => {
    if (isCheckoutOpen) {
      setAmountPaid(total);
    }
  }, [isCheckoutOpen, total]);


  const addToCart = (product: Product) => {
    if (product.unit !== 'pcs') {
      const existingItem = cart.find(item => item.product.id === product.id);
      openQuantityEditor(existingItem ?? { product, quantity: 1, subtotal: product.selling_price, profit: product.selling_price - product.buying_price });
    } else {
        setCart((prevCart) => {
          const existingItem = prevCart.find(
            (item) => item.product.id === product.id
          );
          if (existingItem) {
            return prevCart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.product.selling_price, profit: (item.quantity + 1) * (item.product.selling_price - item.product.buying_price) }
                : item
            );
          } else {
            return [
              ...prevCart,
              {
                product,
                quantity: 1,
                subtotal: product.selling_price,
                profit: product.selling_price - product.buying_price,
              },
            ];
          }
        });
        toast({
          title: t(translations.addedToCart, language === 'bn' ? product.name_bn : product.name_en),
        });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) => {
        const itemInCart = prevCart.find(item => item.product.id === productId);
        if(itemInCart && itemInCart.product.unit !== 'pcs') {
          openQuantityEditor(itemInCart);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity, subtotal: quantity * item.product.selling_price, profit: quantity * (item.product.selling_price - item.product.buying_price) }
            : item
        )
      });
    }
  };
  
  const openQuantityEditor = (item: CartItem) => {
    setEditingQuantity({ item, input: item.quantity.toString() });
  };

  const handleQuantityUpdate = () => {
    if (!editingQuantity) return;

    const newQuantity = parseFloat(editingQuantity.input);
    const product = editingQuantity.item.product;
    
    if (isNaN(newQuantity) || newQuantity <= 0) {
        removeFromCart(product.id);
    } else {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id);
            const updatedItem = {
              product,
              quantity: newQuantity,
              subtotal: newQuantity * product.selling_price,
              profit: newQuantity * (product.selling_price - product.buying_price),
            };

            if(existingItem) {
              return prevCart.map(item => item.product.id === product.id ? updatedItem : item);
            }
            return [...prevCart, updatedItem];
        });
        toast({ title: t(translations.addedToCart, language === 'bn' ? product.name_bn : product.name_en) });
    }
    setEditingQuantity(null);
  };


  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };


  const handleCheckout = () => {
    if(cart.length === 0) {
      toast({
        title: t(translations.cartEmptyTitle),
        description: t(translations.cartEmptyDesc),
        variant: "destructive",
      })
      return;
    }
    setCheckoutOpen(true);
  };

  const handleFinalizeOrder = (paymentMethod: Order['paymentMethod']) => {
    const finalAmountPaid = Number(amountPaid);
    const amountDue = total - finalAmountPaid;
    
    const orderData: Order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      subtotal: cartSubtotal,
      tax,
      discount: 0,
      total,
      totalProfit,
      paymentMethod,
      cashierId: 'cashier_01',
      createdAt: new Date().toISOString(),
      paymentStatus: amountDue > 0 ? 'due' : 'paid',
      amountPaid: finalAmountPaid,
      amountDue
    };
    addOrder(orderData);
    setLastOrder(orderData);
    setReceiptOpen(true);
    setCheckoutOpen(false);
    setCart([]);
    setAmountPaid(0);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', { style: 'currency', currency: 'BDT' }).format(amount);
  }

  const ReceiptDialog = isMobile ? Drawer : Dialog;
  const ReceiptDialogContent = isMobile ? DrawerContent : DialogContent;
  const ReceiptDialogHeader = isMobile ? DrawerHeader : DialogHeader;
  const ReceiptDialogTitle = isMobile ? DrawerTitle : DialogTitle;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
      <div className="lg:col-span-2 h-full flex flex-col p-4 bg-background">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold tracking-tight font-headline">{t(translations.products)}</h2>
            <div className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t(translations.searchPlaceholder)}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <ScrollArea className="flex-1 -mx-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
            {filteredProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addToCart(product)}>
                <CardContent className="p-2">
                    <Image
                    src={product.imageUrl || "https://placehold.co/300x300.png"}
                    alt={product.name_en}
                    width={300}
                    height={300}
                    className="rounded-md object-cover aspect-square"
                    />
                    <h3 className="text-sm font-medium mt-2 truncate">{language === 'bn' ? product.name_bn : product.name_en}</h3>
                    <p className="text-lg font-semibold">{formatCurrency(product.selling_price)}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </ScrollArea>
      </div>

      <div className="col-span-1 h-full flex flex-col p-4 bg-card border-l">
        <Card className="flex-1 flex flex-col">
            <CardHeader>
                <CardTitle>{t(translations.currentOrder)}</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
                <CardContent className="space-y-4">
                {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">{t(translations.cartEmpty)}</p>
                ) : (
                    cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                        <Image src={item.product.imageUrl || 'https://placehold.co/64x64.png'} alt={item.product.name_en} width={64} height={64} className="rounded-md" />
                        <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">{language === 'bn' ? item.product.name_bn : item.product.name_en}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.product.selling_price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.product.unit === 'pcs' ? (
                            <>
                              <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span>{item.quantity}</span>
                              <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" className="h-7 sm:h-8" onClick={() => openQuantityEditor(item)}>
                              {item.quantity} {item.product.unit} <Pencil className="h-3 w-3 ml-2" />
                            </Button>
                          )}
                        </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                          <p className="text-xs text-green-600">{t(translations.profit)}: {formatCurrency(item.profit)}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="text-muted-foreground" onClick={() => removeFromCart(item.product.id)}>
                        <X className="h-4 w-4" />
                        </Button>
                    </div>
                    ))
                )}
                </CardContent>
            </ScrollArea>
            <div className="p-6 border-t">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>{t(translations.subtotal)}</span>
                        <span>{formatCurrency(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t(translations.tax)}</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>{t(translations.estimatedProfit)}</span>
                        <span>{formatCurrency(totalProfit)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>{t(translations.total)}</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
                
                <Button size="lg" className="w-full mt-6" onClick={handleCheckout}>
                  {t(translations.checkout)}
                </Button>
            </div>
        </Card>
      </div>
      
      {/* Quantity Editor Dialog */}
      {editingQuantity && (
        <Dialog open={!!editingQuantity} onOpenChange={() => setEditingQuantity(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t(translations.enterQuantityFor, language === 'bn' ? editingQuantity.item.product.name_bn : editingQuantity.item.product.name_en)}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="quantity">{t(translations.quantity)} ({editingQuantity.item.product.unit})</Label>
                    <Input 
                        id="quantity" 
                        type="number"
                        value={editingQuantity.input}
                        onChange={(e) => setEditingQuantity({...editingQuantity, input: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && handleQuantityUpdate()}
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setEditingQuantity(null)}>{t(translations.cancel)}</Button>
                    <Button onClick={handleQuantityUpdate}>{t(translations.update)}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(translations.completeOrder)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-lg font-bold">
              <span>{t(translations.total)}:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount-paid">{t(translations.amountPaid)}</Label>
              <Input
                id="amount-paid"
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-between text-red-500 font-medium">
              <span>{t(translations.amountDue)}:</span>
              <span>{formatCurrency(total - amountPaid)}</span>
            </div>
          </div>
          <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button onClick={() => handleFinalizeOrder('cash')} className="w-full">Cash</Button>
            <Button onClick={() => handleFinalizeOrder('card')} className="w-full">Card</Button>
            <Button onClick={() => handleFinalizeOrder('mobile-pay')} className="w-full">Mobile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Receipt Dialog */}
      <ReceiptDialog open={isReceiptOpen} onOpenChange={setReceiptOpen}>
          {lastOrder && (
              <ReceiptDialogContent className="max-w-sm">
                  <ReceiptDialogHeader>
                      <ReceiptDialogTitle>{t(translations.receipt)}</ReceiptDialogTitle>
                  </ReceiptDialogHeader>
                  <Receipt order={lastOrder} />
              </ReceiptDialogContent>
          )}
      </ReceiptDialog>

    </div>
  );
}
