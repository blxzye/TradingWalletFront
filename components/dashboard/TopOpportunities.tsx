'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BackendDashboardSummary } from '@/types/backendDashboardSummary';

interface TopOpportunitiesProps {
  opportunities: BackendDashboardSummary['topOpportunities'];
}

const formatCurrency = (value: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value));

const getSignalBadge = (signal: string) => {
  switch (signal) {
    case 'BUY':
      return <Badge className="bg-green-600">Compra Agressiva</Badge>;
    case 'WATCH':
      return <Badge className="bg-blue-600">Observar</Badge>;
    default:
      return <Badge variant="outline">Neutro</Badge>;
  }
};

export function TopOpportunities({ opportunities }: TopOpportunitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Oportunidades (P10)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp.ticker} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 last:border-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{opp.ticker}</span>
                  {getSignalBadge(opp.signal)}
                </div>
                <div className="flex flex-wrap gap-4 mt-1 text-sm">
                  <span>Preço atual: {formatCurrency(opp.currentPrice)}</span>
                  <span>P10: {formatCurrency(opp.p10)}</span>
                  <span className={parseFloat(opp.distancePercent) < 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(parseFloat(opp.distancePercent)).toFixed(1)}% do P10
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}