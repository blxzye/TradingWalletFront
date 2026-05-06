"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Metric {
  title: string;
  value: string;
  trend: string;
}

export function SectionCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="@container/card">
          <CardHeader>
            <CardDescription>{metric.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metric.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {metric.trend.startsWith('-') ? (
                  <IconTrendingDown className="mr-1 size-3" />
                ) : (
                  <IconTrendingUp className="mr-1 size-3" />
                )}
                {metric.trend}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              {metric.title === 'Patrimônio Líquido' && 'Ativos - Passivos'}
              {metric.title === 'Caixa' && 'Saldo disponível'}
              {metric.title === 'Total Investido' && 'Custo total das posições'}
              {metric.title === 'Retorno Total' && 'Rentabilidade sobre o investido'}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}