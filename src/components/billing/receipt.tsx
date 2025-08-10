
"use client";

import React, { useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Order } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { Download, Printer } from "lucide-react";
import { useSettings } from "@/context/settings-context";
import { parseISO } from "date-fns";

interface ReceiptProps {
  order: Order;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ order }, ref) => {
  const { language, t } = useLanguage();
  const { settings } = useSettings();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const translations = {
    print: { en: "Print", bn: "প্রিন্ট" },
    download: { en: "Download", bn: "ডাউনলোড" },
    orderId: { en: "Order ID", bn: "অর্ডার আইডি" },
    date: { en: "Date", bn: "তারিখ" },
    customer: { en: "Customer", bn: "গ্রাহক" },
    phone: { en: "Phone", bn: "ফোন" },
    address: { en: "Address", bn: "ঠিকানা" },
    subtotal: { en: "Subtotal", bn: "উপমোট" },
    total: { en: "Total", bn: "মোট" },
    amountPaid: { en: "Paid", bn: "পরিশোধিত" },
    amountDue: { en: "Due", bn: "বকেয়া" },
    thankYou: { en: "Thank you for shopping with us!", bn: "আমাদের সাথে কেনাকাটার জন্য আপনাকে ধন্যবাদ!" },
  };

  const handlePrint = () => {
    const printableArea = receiptRef.current;
    if (printableArea) {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow?.document.write('<html><head><title>Print Receipt</title>');
      printWindow?.document.write('<style> body { font-family: monospace; margin: 0; } </style>');
      printWindow?.document.write('</head><body>');
      printWindow?.document.write(printableArea.innerHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.focus();
      printWindow?.print();
    }
  };

  const handleDownload = () => {
    const input = receiptRef.current;
    if (input) {
      html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width + 20, canvas.height + 20] 
        });
        pdf.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
        pdf.save(`receipt-${order.id}.pdf`);
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
  }
  
  const orderDate = parseISO(order.createdAt as unknown as string);

  return (
    <div className="bg-white text-black p-4 font-mono text-sm" ref={ref}>
        <div id="printable-receipt" ref={receiptRef} className="p-4 bg-white">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold">{settings.shopName}</h2>
                <p>{settings.shopAddress}</p>
            </div>
            <Separator className="my-2 bg-gray-400" />
            <div className="text-xs">
                <p>{t(translations.orderId)}: {order.id}</p>
                <p>{t(translations.date)}: {orderDate.toLocaleString('bn-BD')}</p>
                {order.customer && (
                    <div className="mt-2">
                        <p className="font-bold">{t(translations.customer)}:</p>
                        <p>{order.customer.name}</p>
                        {order.customer.phone && <p>{t(translations.phone)}: {order.customer.phone}</p>}
                        {order.customer.address && <p>{t(translations.address)}: {order.customer.address}</p>}
                    </div>
                )}
            </div>
            <Separator className="my-2 bg-gray-400" />
            <div>
                {order.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between mb-1">
                    <div>
                        <p>{language === 'bn' ? item.product.name_bn : item.product.name_en}</p>
                        <p className="text-xs">{item.quantity} {item.product.unit} x {formatCurrency(item.product.selling_price)}</p>
                    </div>
                    <p>{formatCurrency(item.subtotal)}</p>
                    </div>
                ))}
            </div>
            <Separator className="my-2 bg-gray-400" />
            <div className="space-y-1">
                <div className="flex justify-between">
                    <p>{t(translations.subtotal)}:</p>
                    <p>{formatCurrency(order.subtotal)}</p>
                </div>
                <Separator className="my-1 bg-gray-400" />
                <div className="flex justify-between font-bold text-base">
                    <p>{t(translations.total)}:</p>
                    <p>{formatCurrency(order.total)}</p>
                </div>
                <div className="flex justify-between">
                    <p>{t(translations.amountPaid)}:</p>
                    <p>{formatCurrency(order.amountPaid)}</p>
                </div>
                {order.amountDue > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                      <p>{t(translations.amountDue)}:</p>
                      <p>{formatCurrency(order.amountDue)}</p>
                  </div>
                )}
            </div>
            <Separator className="my-2 bg-gray-400" />
            <div className="text-center mt-4">
                <p>{t(translations.thankYou)}</p>
            </div>
        </div>
         <div className="flex gap-2 mt-4">
            <Button onClick={handlePrint} className="w-full text-white">
              <Printer className="mr-2" /> {t(translations.print)}
            </Button>
            <Button onClick={handleDownload} className="w-full text-white">
              <Download className="mr-2" /> {t(translations.download)}
            </Button>
         </div>
    </div>
  );
});

Receipt.displayName = "Receipt";

    