'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

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

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Alocação por Categoria</CardTitle>
        <CardDescription>Patrimônio atual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Gráfico */}
          <div className="w-full md:flex-[2] flex items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="aspect-square max-h-[200px] w-full md:max-h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={0}
                    startAngle={0}
                    endAngle={360}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
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
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Legenda */}
          <div className="w-full md:flex-1 flex flex-col justify-center space-y-2 text-xs pb-4 md:pb-0">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="font-medium flex-1">{item.name}</span>
                <span className="text-muted-foreground tabular-nums">
                  {item.percent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      {/* CardFooter removido */}
    </Card>
  );
}