"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Period = "12m" | "2y" | "5y" | "10y";

// Função para gerar dados mockados baseados no período
const generateData = (period: Period) => {
  const monthsMap: Record<Period, number> = {
    "12m": 12,
    "2y": 24,
    "5y": 60,
    "10y": 120,
  };
  const totalMonths = monthsMap[period];
  const data = [];
  let invested = 50000;
  let gain = 2000;

  // Determinar o label do mês/ano
  const getLabel = (index: number, total: number) => {
    if (total <= 24) return `${index + 1}`; // meses
    if (total <= 60) return `${Math.floor(index / 12) + 1}a`; // anos abreviados
    return `${Math.floor(index / 12) + 1}a`;
  };

  for (let i = 0; i < totalMonths; i++) {
    // Simula crescimento com alguma variação
    invested += Math.random() * 1500 - 300;
    gain += Math.random() * 800 - 100;
    gain = Math.max(gain, 0);
    invested = Math.max(invested, 30000);
    data.push({
      month: getLabel(i, totalMonths),
      invested: Math.round(invested),
      gain: Math.round(gain),
      fullDate: new Date(2020, Math.floor(i / 12), (i % 12) + 1).toISOString(), // apenas para ordenação
    });
  }
  return data;
};

const chartConfig = {
  invested: {
    label: "Valor Aplicado",
    color: "var(--chart-1)",
  },
  gain: {
    label: "Ganho de Capital",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartBarStacked() {
  const [period, setPeriod] = useState<Period>("12m");
  const chartData = generateData(period);

  const lastMonth = chartData[chartData.length - 1];
  const patrimonio = lastMonth.invested + lastMonth.gain;
  const maxPatrimonio = Math.max(...chartData.map((d) => d.invested + d.gain));
  const yAxisMax = Math.ceil(maxPatrimonio / 10000) * 10000;

  const periodOptions = [
    { value: "12m", label: "12 meses" },
    { value: "2y", label: "2 anos" },
    { value: "5y", label: "5 anos" },
    { value: "10y", label: "10 anos" },
  ];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Evolução Patrimonial</CardTitle>
            <CardDescription>
              Valor aplicado + ganho de capital (acumulado mensal)
            </CardDescription>
          </div>
          <CardAction>
            <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Período</SelectLabel>
                  {periodOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={period === "12m" ? 0 : Math.floor(chartData.length / 12)}
              />
              <YAxis
                domain={[0, yAxisMax]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    notation: "compact",
                    maximumFractionDigits: 0,
                  }).format(value)
                }
                width={65}
                tickCount={6}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      const formatted = new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(value));
                      const label =
                        name === "invested" ? "Valor Aplicado" : "Ganho de Capital";
                      return [formatted, label];
                    }}
                    labelFormatter={(label) => {
                      if (period === "12m") return `Mês ${label}`;
                      return `Período ${label}`;
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="invested"
                stackId="a"
                fill="var(--color-invested)"
                radius={[0, 0, 4, 4]}
                activeBar={{ fillOpacity: 0.8 }}
              />
              <Bar
                dataKey="gain"
                stackId="a"
                fill="var(--color-gain)"
                radius={[4, 4, 0, 0]}
                activeBar={{ fillOpacity: 0.8 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <div className="flex-col items-start gap-2 text-sm p-6 pt-0">
        <div className="flex gap-2 leading-none font-medium">
          Patrimônio líquido atual:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(patrimonio)}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Valores acumulados por período (investido + ganho = patrimônio)
        </div>
      </div>
    </Card>
  );
}