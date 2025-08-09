"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartTooltipContent,
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
                tickFormatter={(value) => `৳${Number(value) / 1000}k`}
                />
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                    formatter={(value) => typeof value === 'number' ? value.toLocaleString('bn-BD', { style: 'currency', currency: 'BDT' }) : value}
                    />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
