"use client";

import * as React from "react";
import Image from "next/image";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, X, Search } from "lucide-react";
import { type CartItem, type Product } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Receipt } from "./receipt";


export function PosTerminal() {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isReceiptOpen, setReceiptOpen] = React.useState(false);
  const [lastOrder, setLastOrder] = React.useState<any>(null);


  const filteredProducts = products.filter(
    (product) =>
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_bn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
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
      title: `${language === 'bn' ? product.name_bn : product.name_en} কার্টে যোগ করা হয়েছে।`,
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity, subtotal: quantity * item.product.selling_price, profit: quantity * (item.product.selling_price - item.product.buying_price) }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const cartSubtotal = cart.reduce((total, item) => total + item.subtotal, 0);
  const taxRate = 0.05; // 5%
  const tax = cartSubtotal * taxRate;
  const total = cartSubtotal + tax;
  const totalProfit = cart.reduce((total, item) => total + item.profit, 0);

  const handleCheckout = () => {
    if(cart.length === 0) {
      toast({
        title: "কার্ট খালি",
        description: "চেকআউটের আগে দয়া করে কার্টে পণ্য যোগ করুন।",
        variant: "destructive",
      })
      return;
    }
    const orderData = {
      id: `ORD-${Date.now()}`,
      items: cart,
      subtotal: cartSubtotal,
      tax,
      discount: 0,
      total,
      totalProfit,
      paymentMethod: 'cash' as const,
      cashierId: 'cashier_01',
      createdAt: new Date(),
    };
    setLastOrder(orderData);
    setReceiptOpen(true);
    setCart([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
      <div className="lg:col-span-2 h-full flex flex-col p-4 bg-background">
        <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold tracking-tight font-headline">পণ্য</h2>
            <div className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="পণ্য খুঁজুন..."
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
                <CardTitle>বর্তমান অর্ডার</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
                <CardContent className="space-y-4">
                {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">আপনার কার্ট খালি।</p>
                ) : (
                    cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                        <Image src={item.product.imageUrl || 'https://placehold.co/64x64.png'} alt={item.product.name_en} width={64} height={64} className="rounded-md" />
                        <div className="flex-1">
                        <p className="font-medium">{language === 'bn' ? item.product.name_bn : item.product.name_en}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.product.selling_price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Button size="icon" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button size="icon" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                          <p className="text-xs text-green-600">লাভ: {formatCurrency(item.profit)}</p>
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
                        <span>উপমোট</span>
                        <span>{formatCurrency(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>কর (৫%)</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>আনুমানিক লাভ</span>
                        <span>{formatCurrency(totalProfit)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>মোট</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
                
                <Dialog open={isReceiptOpen} onOpenChange={setReceiptOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="w-full mt-6" onClick={handleCheckout}>
                        চেকআউট
                        </Button>
                    </DialogTrigger>
                    {lastOrder && (
                        <DialogContent className="max-w-sm">
                            <DialogHeader>
                                <DialogTitle>রসিদ</DialogTitle>
                            </DialogHeader>
                            <Receipt order={lastOrder} />
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        </Card>
      </div>
    </div>
  );
}
