'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart, Sector } from 'recharts';
import type { PieSectorShapeProps } from 'recharts/types/polar/Pie';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface AllocationItem {
  category: string;
  value: string;
  percent: string;
}

interface ChartDonutActiveProps {
  data: AllocationItem[];
}

// Mapeamento de cores (use as mesmas variáveis CSS do exemplo)
const categoryColors: Record<string, string> = {
  CASH: 'var(--chart-1)',
  STOCK: 'var(--chart-2)',
  FII: 'var(--chart-3)',
  CRYPTO: 'var(--chart-4)',
  BOND: 'var(--chart-5)',
  OTHER: 'var(--chart-6)',
};

export function ChartDonutActive({ data }: ChartDonutActiveProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Converte os dados para o formato do gráfico
  const chartData = data.map((item, index) => ({
    name: item.category,
    value: parseFloat(item.value),
    percent: parseFloat(item.percent),
    fill: categoryColors[item.category] || categoryColors.OTHER,
  }));

  // Configuração dinâmica para o ChartContainer
  const chartConfig: ChartConfig = {
    value: { label: 'Valor (R$)' },
    ...chartData.reduce((acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      };
      return acc;
    }, {} as ChartConfig),
  };

  if (!chartData.length) return null;

  // Total para o centro
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Formato customizado para o tooltip
  const CustomTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
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

  // shape personalizada: destaca o setor ativo (expande 10px)
  const renderActiveShape = (props: PieSectorShapeProps & { index?: number }) => {
    const { index, outerRadius = 0, ...rest } = props;
    const expandedRadius = index === activeIndex ? (outerRadius as number) + 10 : outerRadius;
    return <Sector {...rest} outerRadius={expandedRadius} />;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Alocação por Categoria</CardTitle>
        <CardDescription>Patrimônio atual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<CustomTooltipContent />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              shape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              // option: reset on mouse leave
              onMouseLeave={() => setActiveIndex(0)}
            >
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
            </Pie>
          </PieChart>
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