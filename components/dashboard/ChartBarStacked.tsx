"use client";

import { useState, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

type Period = "12m" | "2y" | "5y" | "10y";

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
  const now = new Date();
  let currentDate = new Date(now.getFullYear(), now.getMonth(), 1);

  for (let i = totalMonths - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const label = `${month.toString().padStart(2, "0")}/${year}`;

    invested += Math.random() * 1500 - 300;
    gain += Math.random() * 800 - 100;
    gain = Math.max(gain, 0);
    invested = Math.max(invested, 30000);

    data.push({
      month: label,
      invested: Math.round(invested),
      gain: Math.round(gain),
      sortOrder: i,
    });
  }
  const sortedOldToNew = data.sort((a, b) => a.sortOrder - b.sortOrder);
  return sortedOldToNew.reverse();
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

// Componente interno do gráfico para reuso
const ChartRenderer = ({ data, period }: { data: ReturnType<typeof generateData>; period: Period }) => {
  const maxPatrimonio = Math.max(...data.map((d) => d.invested + d.gain));
  const yAxisMax = Math.ceil(maxPatrimonio / 10000) * 10000;

  const getTickInterval = () => {
    if (period === "12m") return 0;
    if (period === "2y") return 2;
    if (period === "5y") return 5;
    return 12;
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
            interval={getTickInterval()}
            angle={-30}
            textAnchor="end"
            height={60}
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
                labelFormatter={(label) => `${label}`}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="invested"
            stackId="a"
            fill="var(--color-invested)"
            radius={[0, 0, 4, 4]}
            activeBar={{ fill: "var(--color-invested)", fillOpacity: 0.7 }}
          />
          <Bar
            dataKey="gain"
            stackId="a"
            fill="var(--color-gain)"
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: "var(--color-gain)", fillOpacity: 0.7 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export function ChartBarStacked() {
  const [period, setPeriod] = useState<Period>("12m");
  const chartData = useMemo(() => generateData(period), [period]);

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
          <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <SelectTrigger className="w-[130px]">
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
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 relative">
        {/* Botão de expandir posicionado no canto inferior direito */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 z-10 shadow-md bg-background"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Expandir gráfico</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="!w-[80vw] !max-w-[80vw] h-[70vh] flex flex-col block-content block-graph-outline">
            <DialogHeader>
              <DialogTitle>Evolução Patrimonial</DialogTitle>
            </DialogHeader>
            <div className="flex-1 min-h-0">
              <ChartRenderer data={chartData} period={period} />
            </div>
          </DialogContent>
        </Dialog>
        <ChartRenderer data={chartData} period={period} />
      </CardContent>
    </Card>
  );
}