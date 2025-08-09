"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CategoryChartProps {
    data: { category: string; revenue: number; fill: string; }[];
    title: string;
    description: string;
}

export function CategoryChart({ data, title, description }: CategoryChartProps) {
    const chartConfig = data.reduce((acc, item) => {
        acc[item.category] = { label: item.category, color: item.fill };
        return acc;
    }, {} as ChartConfig);

    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent 
                                hideLabel 
                                formatter={(value) => typeof value === 'number' ? value.toLocaleString('bn-BD', { style: 'currency', currency: 'BDT' }) : value}
                            />}
                        />
                        <Pie
                            data={data}
                            dataKey="revenue"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {data.map((entry) => (
                                <Cell key={`cell-${entry.category}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
