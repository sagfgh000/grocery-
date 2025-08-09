
"use client";

import * as React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { DollarSign, CreditCard, Package, Download } from "lucide-react";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useLanguage } from "@/context/language-context";
import { DateRange } from "react-day-picker";
import { subDays, startOfMonth, endOfMonth, format, eachDayOfInterval, isWithinInterval } from "date-fns";
import { orders, products } from "@/lib/data";
import { Order } from "@/lib/types";

export default function DashboardPage() {
  const { t } = useLanguage();
  const dashboardRef = React.useRef(null);
  
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const translations = {
    dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
    download: { en: "Download", bn: "ডাউনলোড" },
    overview: { en: "Overview", bn: "ခြုံငုံသုံးသပ်ချက်" },
    analytics: { en: "Analytics", bn: "অ্যানালিটিক্স" },
    reports: { en: "Reports", bn: "রিপোর্ট" },
    notifications: { en: "Notifications", bn: "নোটিফিকেশন" },
    totalRevenue: { en: "Total Revenue", bn: "মোট রাজস্ব" },
    totalProfit: { en: "Total Profit", bn: "মোট লাভ" },
    sales: { en: "Sales", bn: "বিক্রয়" },
    productsInStock: { en: "Products in Stock", bn: "স্টকে থাকা পণ্য" },
    topCategories: { en: "Top Categories", bn: "শীর্ষ বিভাগ" },
    topCategoriesDesc: { en: "Revenue by product category for the selected period.", bn: "নির্বাচিত সময়ের জন্য পণ্যের বিভাগ অনুসারে আয়।" },
    recentSales: { en: "Recent Sales", bn: "সাম্প্রতিক বিক্রয়" },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
  }

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      if (!date?.from) return true;
      const toDate = date.to ?? date.from;
      return isWithinInterval(order.createdAt, { start: date.from, end: toDate });
    });
  }, [date]);

  const previousPeriod = React.useMemo(() => {
    if (!date?.from || !date?.to) return { from: subDays(new Date(), 30), to: new Date() };
    const diff = date.to.getTime() - date.from.getTime();
    return {
        from: new Date(date.from.getTime() - diff),
        to: new Date(date.to.getTime() - diff)
    }
  }, [date]);

  const previousOrders = React.useMemo(() => {
    return orders.filter(order => {
      return isWithinInterval(order.createdAt, { start: previousPeriod.from, end: previousPeriod.to });
    });
  }, [previousPeriod]);

  const kpiData = React.useMemo(() => {
    const currentRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const currentProfit = filteredOrders.reduce((sum, order) => sum + order.totalProfit, 0);
    const currentSalesCount = filteredOrders.length;
    
    const prevRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);

    const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : currentRevenue > 0 ? 100 : 0;
    
    const getChangeDescription = (change: number) => {
        if (change === 0) return `no change from previous period`;
        const sign = change > 0 ? '+' : '';
        return `<span class="${change > 0 ? 'text-green-600' : 'text-red-600'}">${sign}${change.toFixed(1)}%</span> from previous period`;
    }

    return {
      totalRevenue: formatCurrency(currentRevenue),
      revenueDesc: getChangeDescription(revenueChange),
      totalProfit: formatCurrency(currentProfit),
      profitDesc: "Calculated from selected period",
      sales: `+${currentSalesCount}`,
      salesDesc: `${filteredOrders.length} orders in selected period`,
      productsInStock: products.length.toString(),
      stockDesc: `${products.filter(p => p.stock_quantity < p.low_stock_threshold).length} products below threshold`,
    }
  }, [filteredOrders, previousOrders, products]);
  
  const salesChartData = React.useMemo(() => {
    if (!date?.from) return [];
    const toDate = date.to ?? date.from;
    const intervalDays = eachDayOfInterval({ start: date.from, end: toDate });

    if (intervalDays.length > 31) { // Monthly
        const months: {[key: string]: number} = {};
        filteredOrders.forEach(order => {
            const month = format(order.createdAt, 'MMM y');
            if(!months[month]) months[month] = 0;
            months[month] += order.total;
        });
        return Object.entries(months).map(([name, total]) => ({name, total})).reverse();
    }
    // Daily
    const days: {[key: string]: number} = {};
    intervalDays.forEach(day => {
        days[format(day, 'MMM d')] = 0;
    })
    filteredOrders.forEach(order => {
        const day = format(order.createdAt, 'MMM d');
        if(days[day] !== undefined) {
            days[day] += order.total;
        }
    });
    return Object.entries(days).map(([name, total]) => ({name, total}));

  }, [filteredOrders, date]);

  const categoryChartData = React.useMemo(() => {
    const categoryRevenue: {[key: string]: { category: string, revenue: number, fill: string }} = {};
    const colors = ['#f56565', '#48bb78', '#4299e1', '#ed8936', '#a0aec0', '#9f7aea', '#f6e05e'];
    let colorIndex = 0;

    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            const category = item.product.category;
            if(!categoryRevenue[category]) {
                categoryRevenue[category] = { category, revenue: 0, fill: colors[colorIndex % colors.length] };
                colorIndex++;
            }
            categoryRevenue[category].revenue += item.subtotal;
        })
    });

    return Object.values(categoryRevenue);
  }, [filteredOrders]);

  const recentSalesDescription = React.useMemo(() => {
    if (!date?.from) return "";
    const toDate = date.to ?? date.from;
    return `You made ${filteredOrders.length} sales between ${format(date.from, "LLL dd, y")} and ${format(toDate, "LLL dd, y")}.`;
  }, [filteredOrders, date]);

  const handleDownload = () => {
    const input = dashboardRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`dashboard-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      });
    }
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">{t(translations.dashboard)}</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={date} setDate={setDate} />
          <Button onClick={handleDownload}><Download className="mr-2" />{t(translations.download)}</Button>
        </div>
      </div>
      <div ref={dashboardRef} className="p-4 bg-background">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t(translations.overview)}</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              {t(translations.analytics)}
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              {t(translations.reports)}
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              {t(translations.notifications)}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard title={t(translations.totalRevenue)} value={kpiData.totalRevenue} description={kpiData.revenueDesc} icon={DollarSign} />
              <KpiCard title={t(translations.totalProfit)} value={kpiData.totalProfit} description={kpiData.profitDesc} icon={DollarSign} />
              <KpiCard title={t(translations.sales)} value={kpiData.sales} description={kpiData.salesDesc} icon={CreditCard} />
              <KpiCard title={t(translations.productsInStock)} value={kpiData.productsInStock} description={kpiData.stockDesc} icon={Package} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
               <SalesChart data={salesChartData} title={t(translations.overview)} />
               <CategoryChart data={categoryChartData} title={t(translations.topCategories)} description={t(translations.topCategoriesDesc)} />
            </div>
             <div className="grid gap-4">
               <RecentSales orders={filteredOrders} title={t(translations.recentSales)} description={recentSalesDescription} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
