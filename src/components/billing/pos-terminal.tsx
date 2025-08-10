
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
import { Plus, Minus, X, Search, Pencil, UserPlus } from "lucide-react";
import { type CartItem, type Product, type Order, type Customer } from "@/lib/types";
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
import { Textarea } from "../ui/textarea";


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
  const [customer, setCustomer] = React.useState<Partial<Customer>>({});
  const [isCustomerDialogOpen, setCustomerDialogOpen] = React.useState(false);

  const isMobile = useIsMobile();

  const translations = {
    products: { en: "Products", bn: "পণ্য" },
    searchPlaceholder: { en: "Search products...", bn: "পণ্য খুঁজুন..." },
    currentOrder: { en: "Current Order", bn: "বর্তমান অর্ডার" },
    cartEmpty: { en: "Your cart is empty.", bn: "আপনার কার্ট খালি।" },
    profit: { en: "Profit", bn: "লাভ" },
    subtotal: { en: "Subtotal", bn: "উপমোট" },
    estimatedProfit: { en: "Estimated Profit", bn: "আনুমানিক লাভ" },
    total: { en: "Total", bn: "মোট" },
    checkout: { en: "Checkout", bn: "চেকআউট" },
    receipt: { en: "Receipt", bn: "রসিদ" },
    cartEmptyTitle: { en: "Cart is empty", bn: "কার্ট খালি" },
    cartEmptyDesc: { en: "Please add products to the cart before checkout.", bn: "চেকআউটের আগে দয়া করে কার্টে পণ্য যোগ করুন।" },
    addedToCart: { en: (product: string) => `${product} added to cart.`, bn: (product: string) => `${product} কার্টে যোগ করা হয়েছে।` },
    notEnoughStock: { en: "Not enough stock", bn: "পর্যাপ্ত স্টক নেই" },
    notEnoughStockDesc: {
      en: (name: string, stock: number, unit: string) => `Only ${stock} ${unit} of ${name} available.`,
      bn: (name: string, stock: number, unit: string) => `${name} এর মাত্র ${stock} ${unit} উপলব্ধ আছে।`,
    },
    completeOrder: { en: "Complete Order", bn: "অর্ডার সম্পন্ন করুন" },
    amountPaid: { en: "Amount Paid", bn: "প্রদত্ত পরিমাণ" },
    amountDue: { en: "Amount Due", bn: "বকেয়া পরিমাণ" },
    paymentMethod: { en: "Payment Method", bn: "পেমেন্ট পদ্ধতি" },
    quantity: { en: "Quantity", bn: "পরিমাণ" },
    updateQuantity: { en: "Update Quantity", bn: "পরিমাণ আপডেট করুন" },
    cancel: { en: "Cancel", bn: "বাতিল" },
    update: { en: "Update", bn: "আপডেট" },
    enterQuantityFor: { en: (name: string) => `Enter quantity for ${name}`, bn: (name: string) => `${name} এর পরিমাণ লিখুন` },
    customerInfo: { en: "Customer Information", bn: "গ্রাহকের তথ্য" },
    customerInfoDesc: { en: "Add customer details for this order.", bn: "এই অর্ডারের জন্য গ্রাহকের বিবরণ যোগ করুন।" },
    customerName: { en: "Customer Name", bn: "গ্রাহকের নাম" },
    phoneNumber: { en: "Phone Number", bn: "ফোন নম্বর" },
    address: { en: "Address", bn: "ঠিকানা" },
    saveCustomer: { en: "Save Customer", bn: "গ্রাহক সংরক্ষণ করুন" },
    addCustomer: { en: "Add Customer", bn: "গ্রাহক যোগ করুন" },
    editCustomer: { en: "Edit Customer", bn: "গ্রাহক সম্পাদনা করুন" },
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_bn.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const cartSubtotal = cart.reduce((total, item) => total + item.subtotal, 0);
  const total = cartSubtotal;
  const totalProfit = cart.reduce((total, item) => total + item.profit, 0);
  
  React.useEffect(() => {
    if (isCheckoutOpen) {
      setAmountPaid(total);
    }
  }, [isCheckoutOpen, total]);

  const checkStock = (product: Product, quantity: number) => {
    if (quantity > product.stock_quantity) {
      toast({
        title: t(translations.notEnoughStock),
        description: t(translations.notEnoughStockDesc, language === 'bn' ? product.name_bn : product.name_en, product.stock_quantity, product.unit),
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    const newQuantity = (existingItem?.quantity || 0) + 1;

    if (product.unit !== 'pcs') {
      openQuantityEditor(existingItem ?? { product, quantity: 1, subtotal: product.selling_price, profit: product.selling_price - product.buying_price });
    } else {
        if (!checkStock(product, newQuantity)) return;
        setCart((prevCart) => {
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
    const itemInCart = cart.find(item => item.product.id === productId);
    if (!itemInCart) return;

    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      if(itemInCart.product.unit !== 'pcs') {
        openQuantityEditor(itemInCart);
        return;
      }
      if (!checkStock(itemInCart.product, quantity)) return;
      setCart((prevCart) => prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity, subtotal: quantity * item.product.selling_price, profit: quantity * (item.product.selling_price - item.product.buying_price) }
          : item
      ));
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
        if (!checkStock(product, newQuantity)) return;
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
    const amountDue = total - amountPaid;
    if(amountDue > 0 && !customer.name) {
      setCustomerDialogOpen(true);
    } else {
      setCheckoutOpen(true);
    }
  };

  const handleFinalizeOrder = (paymentMethod: Order['paymentMethod']) => {
    const finalAmountPaid = Number(amountPaid);
    const amountDue = total - finalAmountPaid;

    if(amountDue > 0 && !customer.name) {
      setCustomerDialogOpen(true);
      return;
    }
    
    const orderData: Order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      subtotal: cartSubtotal,
      discount: 0,
      total,
      totalProfit,
      paymentMethod,
      cashierId: 'cashier_01',
      createdAt: new Date().toISOString(),
      paymentStatus: amountDue > 0 ? 'due' : 'paid',
      amountPaid: finalAmountPaid,
      amountDue,
      customer: customer.name ? { id: `CUST-${Date.now()}`, ...customer } as Customer : undefined,
    };
    addOrder(orderData);
    setLastOrder(orderData);
    setReceiptOpen(true);
    setCheckoutOpen(false);
    setCart([]);
    setAmountPaid(0);
    setCustomer({});
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', { style: 'currency', currency: 'BDT' }).format(amount);
  }

  const ReceiptDialog = isMobile ? Drawer : Dialog;
  const ReceiptDialogContent = isMobile ? DrawerContent : DialogContent;
  const ReceiptDialogHeader = isMobile ? DrawerHeader : DialogHeader;
  const ReceiptDialogTitle = isMobile ? DrawerTitle : DialogTitle;

  const handlePresetQuantity = (amount: number) => {
    if (!editingQuantity) return;
    let finalAmount = amount;
    const unit = editingQuantity.item.product.unit;
    if(unit === 'kg' && amount < 1) { // Assuming amounts < 1 are in grams
        // no conversion needed as input is in kg
    } else if (unit === 'g' && amount >= 1) { // amount is in kg, but unit is g
        finalAmount = amount * 1000;
    }
    setEditingQuantity({ ...editingQuantity, input: finalAmount.toString() });
  }

  const handleSaveCustomer = () => {
    if(customer.name) {
      setCustomerDialogOpen(false);
      setCheckoutOpen(true);
    } else {
      toast({
        title: "Customer name is required",
        variant: "destructive"
      })
    }
  }

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
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t(translations.currentOrder)}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setCustomerDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {customer.name ? t(translations.editCustomer) : t(translations.addCustomer)}
                </Button>
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
                {customer.name && <p className="text-sm text-muted-foreground mb-2">Customer: {customer.name}</p>}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>{t(translations.subtotal)}</span>
                        <span>{formatCurrency(cartSubtotal)}</span>
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
                <div className="py-4 space-y-4">
                    <div>
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
                    {editingQuantity.item.product.unit === 'kg' && (
                       <div className="grid grid-cols-4 gap-2">
                          <Button variant="outline" onClick={() => handlePresetQuantity(0.100)}>100g</Button>
                          <Button variant="outline" onClick={() => handlePresetQuantity(0.250)}>250g</Button>
                          <Button variant="outline" onClick={() => handlePresetQuantity(0.500)}>500g</Button>
                          <Button variant="outline" onClick={() => handlePresetQuantity(1)}>1kg</Button>
                       </div>
                    )}
                     {editingQuantity.item.product.unit === 'g' && (
                       <div className="grid grid-cols-4 gap-2">
                          <Button variant="outline" onClick={() => handlePresetQuantity(100)}>100g</Button>
                          <Button variant="outline" onClick={() => handlePresetQuantity(250)}>250g</Button>
                          <Button variant="outline" onClick={() => handlePresetQuantity(500)}>500g</Button>
                          <Button variant="outline" onClick={() => handlePresetQuantity(1000)}>1kg</Button>
                       </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setEditingQuantity(null)}>{t(translations.cancel)}</Button>
                    <Button onClick={handleQuantityUpdate}>{t(translations.update)}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      {/* Customer Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(translations.customerInfo)}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">{t(translations.customerName)} *</Label>
              <Input id="customer-name" value={customer.name ?? ''} onChange={(e) => setCustomer(c => ({...c, name: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">{t(translations.phoneNumber)}</Label>
              <Input id="customer-phone" value={customer.phone ?? ''} onChange={(e) => setCustomer(c => ({...c, phone: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-address">{t(translations.address)}</Label>
              <Textarea id="customer-address" value={customer.address ?? ''} onChange={(e) => setCustomer(c => ({...c, address: e.target.value}))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCustomerDialogOpen(false)}>{t(translations.cancel)}</Button>
            <Button onClick={handleSaveCustomer}>{t(translations.saveCustomer)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(translations.completeOrder)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {customer.name && <p className="text-sm font-medium">Customer: {customer.name}</p>}
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

    