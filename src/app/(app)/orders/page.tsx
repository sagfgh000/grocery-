
"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { useData } from "@/context/data-context";
  import { useLanguage } from "@/context/language-context";
  import { useMemo } from "react";
  import { parseISO } from "date-fns";
  
  export default function OrdersPage() {
    const { t } = useLanguage();
    const { orders } = useData();
    const translations = {
        orders: { en: "Orders", bn: "অর্ডার" },
        orderId: { en: "Order ID", bn: "অর্ডার আইডি" },
        date: { en: "Date", bn: "তারিখ" },
        paymentMethod: { en: "Payment Method", bn: "পেমেন্ট পদ্ধতি" },
        paymentStatus: { en: "Payment Status", bn: "পেমেন্ট স্ট্যাটাস" },
        totalAmount: { en: "Total Amount", bn: "মোট পরিমাণ" },
        amountDue: { en: "Amount Due", bn: "বকেয়া" },
        paid: { en: "Paid", bn: "পরিশোধিত" },
        due: { en: "Due", bn: "বকেয়া" },
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
    }
    
    const parsedOrders = useMemo(() => orders.map(o => ({...o, createdAt: parseISO(o.createdAt as unknown as string)})).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()), [orders]);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">{t(translations.orders)}</h2>
            </div>
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky left-0 bg-card">{t(translations.orderId)}</TableHead>
                            <TableHead>{t(translations.date)}</TableHead>
                            <TableHead>{t(translations.paymentMethod)}</TableHead>
                            <TableHead>{t(translations.paymentStatus)}</TableHead>
                            <TableHead className="text-right">{t(translations.totalAmount)}</TableHead>
                            <TableHead className="text-right">{t(translations.amountDue)}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parsedOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium sticky left-0 bg-card whitespace-nowrap">{order.id}</TableCell>
                                <TableCell className="whitespace-nowrap">{order.createdAt.toLocaleDateString('bn-BD')}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{order.paymentMethod}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                                      {t(translations[order.paymentStatus as keyof typeof translations])}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">{formatCurrency(order.total)}</TableCell>
                                <TableCell className="text-right text-destructive whitespace-nowrap">
                                  {order.amountDue > 0 ? formatCurrency(order.amountDue) : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            </div>
        </div>
    )
  }
