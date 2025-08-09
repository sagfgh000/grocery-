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
import { DollarSign, CreditCard, Package, Users } from "lucide-react";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">ড্যাশবোর্ড</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>ডাউনলোড</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">ခြုံငုံသုံးသပ်ချက်</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
          অ্যানালিটিক্স
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
          রিপোর্ট
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
          নোটিফিকেশন
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="মোট রাজস্ব" value="৳৪,৫২৩,১৮৯" description="গত মাস থেকে +২০.১%" icon={DollarSign} />
            <KpiCard title="মোট লাভ" value="৳১,২৮৭,৪২১" description="গত মাস থেকে +১৮.৩%" icon={DollarSign} />
            <KpiCard title="বিক্রয়" value="+২৩৫০" description="গত মাস থেকে +১৫.১%" icon={CreditCard} />
            <KpiCard title="স্টকে থাকা পণ্য" value="১,২৩৪" description="থ্রেশহোল্ডের নিচে ১২" icon={Package} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>ခြုံငုံသုံးသပ်ချက်</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
              <CardHeader>
                <CardTitle>শীর্ষ বিভাগ</CardTitle>
                <CardDescription>
                এই মাসে পণ্যের বিভাগ অনুসারে আয়।
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
                <CardTitle>সাম্প্রতিক বিক্রয়</CardTitle>
                <CardDescription>
                আপনি এই মাসে ২৬৫টি বিক্রয় করেছেন।
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
