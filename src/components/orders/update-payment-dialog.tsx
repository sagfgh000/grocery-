
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type Order } from "@/lib/types";
import { useLanguage } from "@/context/language-context";

interface UpdatePaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  order: Order;
  onUpdatePayment: (orderId: string, newPayment: number) => void;
}

export function UpdatePaymentDialog({ isOpen, onOpenChange, order, onUpdatePayment }: UpdatePaymentDialogProps) {
  const { t } = useLanguage();
  const [paymentAmount, setPaymentAmount] = React.useState<string>("");

  const translations = {
    updatePayment: { en: "Order Details", bn: "অর্ডারের বিবরণ" },
    orderId: { en: "Order ID", bn: "অর্ডার আইডি" },
    customerName: { en: "Customer", bn: "গ্রাহক" },
    phone: { en: "Phone", bn: "ফোন" },
    address: { en: "Address", bn: "ঠিকানা" },
    totalAmount: { en: "Total Amount", bn: "মোট পরিমাণ" },
    amountPaid: { en: "Amount Paid", bn: "পরিশোধিত পরিমাণ" },
    amountDue: { en: "Amount Due", bn: "বকেয়া পরিমাণ" },
    enterPayment: { en: "Enter New Payment Amount", bn: "নতুন পেমেন্টের পরিমাণ লিখুন" },
    update: { en: "Update Payment", bn: "পেমেন্ট আপডেট করুন" },
    close: { en: "Close", bn: "বন্ধ করুন" },
    walkingCustomer: { en: "Walking Customer", bn: "সাধারণ গ্রাহক"}
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
  }

  const handleUpdate = () => {
    const newPayment = parseFloat(paymentAmount);
    if (!isNaN(newPayment) && newPayment > 0) {
      onUpdatePayment(order.id, newPayment);
      setPaymentAmount("");
      onOpenChange(false);
    }
  };

  React.useEffect(() => {
    if(isOpen) {
      setPaymentAmount("");
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(translations.updatePayment)}</DialogTitle>
          <DialogDescription>{t(translations.orderId)}: {order.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
              <p className="font-medium">{t(translations.customerName)}</p>
              <p>{order.customer?.name || t(translations.walkingCustomer)}</p>
            </div>
            {order.customer?.phone && (
              <div>
                <p className="font-medium">{t(translations.phone)}</p>
                <p>{order.customer.phone}</p>
              </div>
            )}
            {order.customer?.address && (
              <div>
                <p className="font-medium">{t(translations.address)}</p>
                <p>{order.customer.address}</p>
              </div>
            )}
            
            <Separator />
          
            <div className="grid grid-cols-2 gap-4">
                <div>
                <p className="font-medium">{t(translations.totalAmount)}</p>
                <p>{formatCurrency(order.total)}</p>
                </div>
                <div>
                <p className="font-medium">{t(translations.amountPaid)}</p>
                <p>{formatCurrency(order.amountPaid)}</p>
                </div>
            </div>
            <div className="font-bold text-red-500">
                <p>{t(translations.amountDue)}</p>
                <p>{formatCurrency(order.amountDue)}</p>
            </div>

            {order.paymentStatus === 'due' && (
              <>
                <Separator />
                <div className="space-y-2">
                    <Label htmlFor="payment-amount">{t(translations.enterPayment)}</Label>
                    <Input
                    id="payment-amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    />
                </div>
              </>
            )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t(translations.close)}</Button>
          {order.paymentStatus === 'due' && (
            <Button onClick={handleUpdate} disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}>{t(translations.update)}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
