"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { products } from "@/lib/data"

const chartData = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
        acc[category] = { category, revenue: 0, fill: `hsl(${Math.random() * 360}, 70%, 50%)`};
    }
    acc[category].revenue += Math.random() * 5000; // Mock revenue
    return acc;
}, {} as any)


const chartConfig = Object.values(chartData).reduce((acc, data: any) => {
    acc[data.category] = { label: data.category, color: data.fill };
    return acc;
}, {} as ChartConfig);


export function CategoryChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={Object.values(chartData)}
          dataKey="revenue"
          nameKey="category"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  )
}
