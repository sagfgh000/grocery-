
      
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
import { CreditCard, Package, Download, BarChart2 } from "lucide-react";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useLanguage } from "@/context/language-context";
import { DateRange } from "react-day-picker";
import { subDays, startOfMonth, endOfMonth, format, eachDayOfInterval, isWithinInterval, parseISO, endOfDay } from "date-fns";
import { bn, enUS } from "date-fns/locale";
import { useData } from "@/context/data-context";
import { Order } from "@/lib/types";
import { useSettings } from "@/context/settings-context";

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const dashboardRef = React.useRef(null);
  const { products, orders } = useData();
  const { settings } = useSettings();
  
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const translations = {
    dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
    download: { en: "Download", bn: "ডাউনলোড" },
    overview: { en: "Overview", bn: "সংক্ষিপ্ত বিবরণ" },
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
    fromPreviousPeriod: { en: "from previous period", bn: "পূর্ববর্তী সময়ের থেকে" },
    noChange: { en: "no change from previous period", bn: "পূর্ববর্তী সময়ের থেকে কোন পরিবর্তন নেই" },
    calculatedForPeriod: { en: "Calculated from selected period", bn: "নির্বাচিত সময় থেকে গণনা করা হয়েছে" },
    ordersInPeriod: { en: "orders in selected period", bn: "নির্বাচিত সময়ে অর্ডার" },
    productsBelowThreshold: { en: "products below threshold", bn: "থ্রেশহোল্ডের নিচে পণ্য" },
    recentSalesDesc: { 
      en: (count: number, from: string, to: string) => `You made ${count} sales between ${from} and ${to}.`,
      bn: (count: number, from: string, to: string) => `আপনি ${from} থেকে ${to} এর মধ্যে ${count}টি বিক্রয় করেছেন।`,
    },
    salesReport: { en: "Sales Report", bn: "বিক্রয় রিপোর্ট" },
    reportFor: { en: "Report for", bn: "এর জন্য রিপোর্ট" },
    to: { en: "to", bn: "থেকে" },
    summary: { en: "Summary", bn: "সারসংক্ষেপ" },
    totalOrders: { en: "Total Orders", bn: "মোট অর্ডার" },
    totalItemsSold: { en: "Total Items Sold", bn: "বিক্রি হওয়া মোট আইটেম" },
    totalDueAmount: { en: "Total Due Amount", bn: "মোট বকেয়া পরিমাণ" },
    orderId: { en: "Order ID", bn: "অর্ডার আইডি" },
    orderDate: { en: "Date", bn: "তারিখ" },
    subtotal: { en: "Subtotal", bn: "উপমোট" },
    tax: { en: "Tax", bn: "কর" },
    total: { en: "Total", bn: "মোট" },
    amountPaid: { en: "Paid", bn: "পরিশোধিত" },
    amountDue: { en: "Due", bn: "বকেয়া" },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', { style: 'currency', currency: 'BDT' }).format(amount);
  }
  
  const formatDate = (d: Date) => {
      const locale = language === 'bn' ? bn : enUS;
      return format(d, "LLL dd, y", { locale });
  }

  const parsedOrders = React.useMemo(() => orders.map(o => ({...o, createdAt: parseISO(o.createdAt as unknown as string)})), [orders]);

  const filteredOrders = React.useMemo(() => {
    if (!date?.from) return [];
    const toDate = date.to ?? date.from;
    return parsedOrders.filter(order => isWithinInterval(order.createdAt, { start: date.from!, end: endOfDay(toDate) }));
  }, [date, parsedOrders]);

  const previousPeriod = React.useMemo(() => {
    if (!date?.from || !date?.to) return { from: subDays(new Date(), 30), to: new Date() };
    const diff = date.to.getTime() - date.from.getTime();
    return {
        from: new Date(date.from.getTime() - diff),
        to: new Date(date.to.getTime() - diff)
    }
  }, [date]);

  const previousOrders = React.useMemo(() => {
    if (!previousPeriod) return [];
    return parsedOrders.filter(order => isWithinInterval(order.createdAt, { start: previousPeriod.from, end: previousPeriod.to }));
  }, [previousPeriod, parsedOrders]);

  const kpiData = React.useMemo(() => {
    if (!date) {
        return {
            totalRevenue: formatCurrency(0),
            revenueDesc: t(translations.noChange),
            totalProfit: formatCurrency(0),
            profitDesc: t(translations.calculatedForPeriod),
            sales: "+0",
            salesDesc: `0 ${t(translations.ordersInPeriod)}`,
            productsInStock: products.length.toString(),
            stockDesc: `0 ${t(translations.productsBelowThreshold)}`,
        }
    }
    const currentRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const currentProfit = filteredOrders.reduce((sum, order) => sum + order.totalProfit, 0);
    const currentSalesCount = filteredOrders.length;
    
    const prevRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);

    const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : currentRevenue > 0 ? 100 : 0;
    
    const getChangeDescription = (change: number) => {
        if (change === 0) return t(translations.noChange);
        const sign = change > 0 ? '+' : '';
        const color = change > 0 ? 'text-green-600' : 'text-red-600';
        return `<span class="${color}">${sign}${change.toFixed(1)}%</span> ${t(translations.fromPreviousPeriod)}`;
    }
    
    const lowStockCount = products.filter(p => p.stock_quantity < p.low_stock_threshold).length;

    return {
      totalRevenue: formatCurrency(currentRevenue),
      revenueDesc: getChangeDescription(revenueChange),
      totalProfit: formatCurrency(currentProfit),
      profitDesc: t(translations.calculatedForPeriod),
      sales: `+${currentSalesCount}`,
      salesDesc: `${filteredOrders.length} ${t(translations.ordersInPeriod)}`,
      productsInStock: products.length.toString(),
      stockDesc: `${lowStockCount} ${t(translations.productsBelowThreshold)}`,
    }
  }, [filteredOrders, previousOrders, date, t, language, products]);
  
  const salesChartData = React.useMemo(() => {
    if (!date?.from) return [];
    const toDate = date.to ?? date.from;
    const intervalDays = eachDayOfInterval({ start: date.from, end: toDate });
    const locale = language === 'bn' ? bn : enUS;

    if (intervalDays.length > 31) { // Monthly
        const months: {[key: string]: number} = {};
        filteredOrders.forEach(order => {
            const month = format(order.createdAt, 'MMM y', { locale });
            if(!months[month]) months[month] = 0;
            months[month] += order.total;
        });
        return Object.entries(months).map(([name, total]) => ({name, total})).reverse();
    }
    // Daily
    const days: {[key: string]: number} = {};
    intervalDays.forEach(day => {
        days[format(day, 'MMM d', { locale })] = 0;
    })
    filteredOrders.forEach(order => {
        const day = format(order.createdAt, 'MMM d', { locale });
        if(days[day] !== undefined) {
            days[day] += order.total;
        }
    });
    return Object.entries(days).map(([name, total]) => ({name, total}));

  }, [filteredOrders, date, language]);

  const categoryChartData = React.useMemo(() => {
    const categoryRevenue: {[key: string]: { category: string; revenue: number; fill: string }} = {};
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
    const fromDateFormatted = formatDate(date.from);
    const toDateFormatted = formatDate(toDate);
    const translationFn = translations.recentSalesDesc[language];
    if (typeof translationFn === 'function') {
      return translationFn(filteredOrders.length, fromDateFormatted, toDateFormatted);
    }
    return '';
  }, [filteredOrders, date, language, t]);

  const handleDownload = () => {
    if (!date?.from || filteredOrders.length === 0) {
        alert("Please select a date range with orders to generate a report.");
        return;
    }

    const doc = new jsPDF();
    const toDate = date.to ?? date.from;
    let yPosition = 15;

    const addText = (text: string, x: number, y: number, options?: any) => {
        doc.text(text, x, y, options);
    };
    
    const checkPageBreak = (y: number) => {
        if (y > 280) {
            doc.addPage();
            return 15;
        }
        return y;
    };

    // Report Header
    doc.setFontSize(16);
    addText(t(translations.salesReport), 105, yPosition, { align: 'center' });
    yPosition += 8;
    doc.setFontSize(10);
    addText(`${t(translations.reportFor)}: ${formatDate(date.from)} ${t(translations.to)} ${formatDate(toDate)}`, 105, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Global Summary
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalProfit = filteredOrders.reduce((sum, order) => sum + order.totalProfit, 0);
    const totalItemsSold = filteredOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const totalDue = filteredOrders.reduce((sum, order) => sum + order.amountDue, 0);
    
    doc.setFontSize(12);
    addText(t(translations.summary), 14, yPosition);
    yPosition += 6;
    doc.setFontSize(10);
    addText(`${t(translations.totalRevenue)}: ${formatCurrency(totalRevenue)}`, 14, yPosition);
    yPosition += 5;
    addText(`${t(translations.totalProfit)}: ${formatCurrency(totalProfit)}`, 14, yPosition);
    yPosition += 5;
    addText(`${t(translations.totalOrders)}: ${filteredOrders.length}`, 14, yPosition);
    yPosition += 5;
    addText(`${t(translations.totalItemsSold)}: ${totalItemsSold.toFixed(2)}`, 14, yPosition);
    yPosition += 5;
    addText(`${t(translations.totalDueAmount)}: ${formatCurrency(totalDue)}`, 14, yPosition);
    yPosition += 10;


    // Loop through each order and print its details
    filteredOrders.forEach((order, index) => {
        const orderDate = parseISO(order.createdAt as unknown as string);
        
        yPosition = checkPageBreak(yPosition + 10);
        doc.setLineWidth(0.5);
        doc.line(14, yPosition - 5, 196, yPosition - 5);
        
        doc.setFontSize(11);
        addText(`${t(translations.orderId)}: ${order.id}`, 14, yPosition);
        addText(`${t(translations.orderDate)}: ${orderDate.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}`, 120, yPosition);
        yPosition += 7;

        // Items Header
        doc.setFont(undefined, 'bold');
        addText(t({ en: 'Item', bn: 'আইটেম'}), 14, yPosition);
        addText(t({ en: 'Qty', bn: 'পরিমাণ'}), 120, yPosition);
        addText(t({ en: 'Price', bn: 'মূল্য'}), 150, yPosition);
        addText(t({ en: 'Subtotal', bn: 'উপমোট'}), 196, yPosition, { align: 'right' });
        yPosition += 5;
        doc.setFont(undefined, 'normal');

        // Items
        order.items.forEach(item => {
            yPosition = checkPageBreak(yPosition);
            const itemName = language === 'bn' ? item.product.name_bn : item.product.name_en;
            const quantityText = `${item.quantity} ${item.product.unit}`;
            const priceText = formatCurrency(item.product.selling_price);
            const subtotalText = formatCurrency(item.subtotal);
            addText(itemName.substring(0, 40), 14, yPosition);
            addText(quantityText, 120, yPosition);
            addText(priceText, 150, yPosition);
            addText(subtotalText, 196, yPosition, { align: 'right' });
            yPosition += 5;
        });

        yPosition += 3;
        doc.setLineWidth(0.1);
        doc.line(120, yPosition - 2, 196, yPosition - 2);

        // Totals for order
        yPosition = checkPageBreak(yPosition);
        addText(`${t(translations.subtotal)}:`, 150, yPosition);
        addText(formatCurrency(order.subtotal), 196, yPosition, { align: 'right' });
        yPosition += 5;
        
        yPosition = checkPageBreak(yPosition);
        addText(`${t(translations.tax)}:`, 150, yPosition);
        addText(formatCurrency(order.tax), 196, yPosition, { align: 'right' });
        yPosition += 5;

        doc.setFont(undefined, 'bold');
        yPosition = checkPageBreak(yPosition);
        addText(`${t(translations.total)}:`, 150, yPosition);
        addText(formatCurrency(order.total), 196, yPosition, { align: 'right' });
        yPosition += 5;
        doc.setFont(undefined, 'normal');
        
        yPosition = checkPageBreak(yPosition);
        addText(`${t(translations.amountPaid)}:`, 150, yPosition);
        addText(formatCurrency(order.amountPaid), 196, yPosition, { align: 'right' });
        yPosition += 5;

        if (order.amountDue > 0) {
            doc.setFont(undefined, 'bold');
            yPosition = checkPageBreak(yPosition);
            addText(`${t(translations.amountDue)}:`, 150, yPosition);
            addText(formatCurrency(order.amountDue), 196, yPosition, { align: 'right' });
            yPosition += 5;
            doc.setFont(undefined, 'normal');
        }
    });

    doc.save(`sales-report-${format(date.from, 'yyyy-MM-dd')}-to-${format(toDate, 'yyyy-MM-dd')}.pdf`);
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="hidden md:block text-3xl font-bold tracking-tight font-headline">{t(translations.dashboard)}</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <CalendarDateRangePicker date={date} setDate={setDate} />
          <Button onClick={handleDownload} className="w-full sm:w-auto"><Download className="mr-2" />{t(translations.download)}</Button>
        </div>
      </div>
      <div ref={dashboardRef} className="p-0 md:p-4 bg-background">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t(translations.overview)}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard title={t(translations.totalRevenue)} value={kpiData.totalRevenue} description={kpiData.revenueDesc} />
              <KpiCard title={t(translations.totalProfit)} value={kpiData.totalProfit} description={kpiData.profitDesc} />
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
