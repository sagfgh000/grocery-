
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
    updatePayment: { en: "Update Payment", bn: "পেমেন্ট আপডেট করুন" },
    orderId: { en: "Order ID", bn: "অর্ডার আইডি" },
    totalAmount: { en: "Total Amount", bn: "মোট পরিমাণ" },
    amountPaid: { en: "Amount Paid", bn: "পরিশোধিত পরিমাণ" },
    amountDue: { en: "Amount Due", bn: "বকেয়া পরিমাণ" },
    enterPayment: { en: "Enter New Payment Amount", bn: "নতুন পেমেন্টের পরিমাণ লিখুন" },
    update: { en: "Update", bn: "আপডেট" },
    cancel: { en: "Cancel", bn: "বাতিল" },
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(translations.updatePayment)}</DialogTitle>
          <DialogDescription>{t(translations.orderId)}: {order.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t(translations.cancel)}</Button>
          <Button onClick={handleUpdate}>{t(translations.update)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
