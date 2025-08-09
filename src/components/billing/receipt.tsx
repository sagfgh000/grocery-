"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Order } from "@/lib/types";
import { useLanguage } from "@/context/language-context";

interface ReceiptProps {
  order: Order;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ order }, ref) => {
  const { language } = useLanguage();
  
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
  }

  return (
    <div className="bg-white text-black p-4 font-mono text-sm" ref={ref}>
        <div id="printable-receipt">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold">GrocerEase</h2>
                <p>123 Fresh St, Farmville, USA</p>
                <p>Order ID: {order.id}</p>
                <p>Date: {order.createdAt.toLocaleString('bn-BD')}</p>
            </div>
            <Separator className="my-2 bg-gray-400" />
            <div>
                {order.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between mb-1">
                    <div>
                        <p>{language === 'bn' ? item.product.name_bn : item.product.name_en}</p>
                        <p className="text-xs">{item.quantity} x {formatCurrency(item.product.selling_price)}</p>
                    </div>
                    <p>{formatCurrency(item.subtotal)}</p>
                    </div>
                ))}
            </div>
            <Separator className="my-2 bg-gray-400" />
            <div className="space-y-1">
                <div className="flex justify-between">
                    <p>Subtotal:</p>
                    <p>{formatCurrency(order.subtotal)}</p>
                </div>
                <div className="flex justify-between">
                    <p>Tax:</p>
                    <p>{formatCurrency(order.tax)}</p>
                </div>
                <div className="flex justify-between font-bold text-base">
                    <p>Total:</p>
                    <p>{formatCurrency(order.total)}</p>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                    <p>Total Profit:</p>
                    <p>{formatCurrency(order.totalProfit)}</p>
                </div>
            </div>
            <Separator className="my-2 bg-gray-400" />
            <div className="text-center mt-4">
                <p>Thank you for shopping with us!</p>
            </div>
        </div>
        <style jsx global>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                #printable-receipt, #printable-receipt * {
                    visibility: visible;
                }
                #printable-receipt {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
            }
        `}</style>
         <Button onClick={handlePrint} className="w-full mt-4 text-white">Print Receipt</Button>
    </div>
  );
});

Receipt.displayName = "Receipt";
