'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

// Tooltip customizado (usando componente nativo do recharts, sem tipos complexos)
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const entry = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-medium">{entry.name}</p>
        <p className="text-sm text-muted-foreground">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)} ({entry.percent.toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

interface AllocationItem {
  category: string;
  value: string;
  percent: string;
}

interface ChartDonutActiveProps {
  data: AllocationItem[];
}

const categoryColors: Record<string, string> = {
  CASH: 'var(--chart-1)',
  STOCK: 'var(--chart-2)',
  FII: 'var(--chart-3)',
  CRYPTO: 'var(--chart-4)',
  BOND: 'var(--chart-5)',
  OTHER: 'var(--chart-6)',
};

export function ChartDonutActive({ data }: ChartDonutActiveProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = data.map((item) => ({
    name: item.category,
    value: parseFloat(item.value),
    percent: parseFloat(item.percent),
    fill: categoryColors[item.category] || categoryColors.OTHER,
  }));

  const chartConfig: ChartConfig = {
    value: { label: 'Valor (R$)' },
    ...chartData.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {} as ChartConfig),
  };

  if (!chartData.length) return null;

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Alocação por Categoria</CardTitle>
        <CardDescription>Patrimônio atual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.fill}
                    stroke={activeIndex === idx ? 'white' : 'none'}
                    strokeWidth={activeIndex === idx ? 3 : 0}
                  />
                ))}
              </Pie>
              <CustomTooltip />
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Alocação atual <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Passe o mouse sobre as fatias para destacar
        </div>
      </CardFooter>
    </Card>
  );
}