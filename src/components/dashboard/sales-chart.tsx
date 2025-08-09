"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartTooltipContent,
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface SalesChartProps {
    data: { name: string; total: number }[];
    title: string;
}

export function SalesChart({ data, title }: SalesChartProps) {
  const { language } = useLanguage();
  
  const tickFormatter = (value: number) => {
    const num = Number(value);
    if (language === 'bn') {
        if (num >= 10000000) return `৳${(num / 10000000).toFixed(1)}কো`;
        if (num >= 100000) return `৳${(num / 100000).toFixed(1)}লা`;
        if (num >= 1000) return `৳${(num / 1000).toFixed(1)}হা`;
        return `৳${num}`;
    }
    if (num >= 1000) return `৳${num / 1000}k`;
    return `৳${num}`;
  };
  
  return (
    <Card className="col-span-4">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={data}>
                <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={tickFormatter}
                />
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                    formatter={(value) => typeof value === 'number' ? value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', { style: 'currency', currency: 'BDT' }) : value}
                    />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
