"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

// Gera os últimos 12 meses com dados fictícios (evolução)
const generateLast12Months = () => {
  const months = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("pt-BR", { month: "short" });
    // Dados simulados: investido começa em 50000 e varia, ganho acumula
    const baseInvested = 50000 + (11 - i) * 500; // cresce 500 por mês
    const gain = 2000 + (11 - i) * 300; // ganho cresce 300 por mês
    months.push({
      month: monthName,
      invested: baseInvested,
      gain: gain,
    });
  }
  return months;
};

const chartData = generateLast12Months();

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
  // Calcular patrimônio líquido atual (último mês)
  const lastMonth = chartData[chartData.length - 1];
  const currentNetWorth = lastMonth.invested + lastMonth.gain;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Evolução Patrimonial (12 meses)</CardTitle>
        <CardDescription>Valor aplicado vs. ganho de capital acumulado</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const formatted = new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(value));
                    const label = name === "invested" ? "Valor Aplicado" : "Ganho de Capital";
                    return [formatted, label];
                  }}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="invested"
              stackId="a"
              fill="var(--color-invested)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="gain"
              stackId="a"
              fill="var(--color-gain)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Patrimônio líquido atual:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(currentNetWorth)}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Últimos 12 meses (investido + ganho = patrimônio)
        </div>
      </CardFooter>
    </Card>
  );
}