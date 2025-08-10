
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Order } from "@/lib/types";
import { useLanguage } from "@/context/language-context";

interface RecentSalesProps {
    orders: Order[];
    title: string;
    description: string;
}

export function RecentSales({ orders, title, description }: RecentSalesProps) {
  const { t } = useLanguage();

  const translations = {
      walkingCustomer: { en: "Walking Customer", bn: "সাধারণ গ্রাহক"}
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {orders.slice(0, 5).map((order) => (
            <div className="flex items-center" key={order.id}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${order.customer?.name?.charAt(0) || 'C'}`} alt="Avatar" />
                <AvatarFallback>{order.customer?.name?.charAt(0) || 'C'}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{order.customer?.name || t(translations.walkingCustomer)}</p>
                <p className="text-sm text-muted-foreground">{order.id}</p>
              </div>
              <div className="ml-auto font-medium">{formatCurrency(order.total)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
