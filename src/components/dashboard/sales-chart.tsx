"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartTooltipContent,
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

const data = [
  { name: "Jan", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Feb", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Mar", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Apr", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "May", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Jun", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Jul", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Aug", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Sep", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Oct", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Nov", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Dec", total: Math.floor(Math.random() * 500000) + 100000 },
]

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function SalesChart() {
  return (
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
            formatter={(value) => value.toLocaleString('bn-BD', { style: 'currency', currency: 'BDT' })}
            />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
