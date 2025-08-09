
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { DollarSign, CreditCard, Package } from "lucide-react";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useLanguage } from "@/context/language-context";

export default function DashboardPage() {
  const { t } = useLanguage();

  const translations = {
    dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
    download: { en: "Download", bn: "ডাউনলোড" },
    overview: { en: "Overview", bn: "ခြုံငုံသုံးသပ်ချက်" },
    analytics: { en: "Analytics", bn: "অ্যানালিটিক্স" },
    reports: { en: "Reports", bn: "রিপোর্ট" },
    notifications: { en: "Notifications", bn: "নোটিফিকেশন" },
    totalRevenue: { en: "Total Revenue", bn: "মোট রাজস্ব" },
    revenueDesc: { en: "+20.1% from last month", bn: "গত মাস থেকে +২০.১%" },
    totalProfit: { en: "Total Profit", bn: "মোট লাভ" },
    profitDesc: { en: "+18.3% from last month", bn: "গত মাস থেকে +১৮.৩%" },
    sales: { en: "Sales", bn: "বিক্রয়" },
    salesDesc: { en: "+15.1% from last month", bn: "গত মাস থেকে +১৫.১%" },
    productsInStock: { en: "Products in Stock", bn: "স্টকে থাকা পণ্য" },
    stockDesc: { en: "12 below threshold", bn: "থ্রেশহোল্ডের নিচে ১২" },
    topCategories: { en: "Top Categories", bn: "শীর্ষ বিভাগ" },
    topCategoriesDesc: { en: "Revenue by product category this month.", bn: "এই মাসে পণ্যের বিভাগ অনুসারে আয়।" },
    recentSales: { en: "Recent Sales", bn: "সাম্প্রতিক বিক্রয়" },
    recentSalesDesc: { en: "You made 265 sales this month.", bn: "আপনি এই মাসে ২৬৫টি বিক্রয় করেছেন।" },
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">{t(translations.dashboard)}</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>{t(translations.download)}</Button>
        </div>
      </div>
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
            <KpiCard title={t(translations.totalRevenue)} value="৳৪,৫২৩,১৮৯" description={t(translations.revenueDesc)} icon={DollarSign} />
            <KpiCard title={t(translations.totalProfit)} value="৳১,২৮৭,৪২১" description={t(translations.profitDesc)} icon={DollarSign} />
            <KpiCard title={t(translations.sales)} value="+২৩৫০" description={t(translations.salesDesc)} icon={CreditCard} />
            <KpiCard title={t(translations.productsInStock)} value="১,২৩৪" description={t(translations.stockDesc)} icon={Package} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{t(translations.overview)}</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
              <CardHeader>
                <CardTitle>{t(translations.topCategories)}</CardTitle>
                <CardDescription>
                  {t(translations.topCategoriesDesc)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
          </div>
           <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t(translations.recentSales)}</CardTitle>
                <CardDescription>
                  {t(translations.recentSalesDesc)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
