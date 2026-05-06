import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Wallet, Building2, Receipt, Gauge } from 'lucide-react';

interface BigNumbersCardProps {
  summary: DashboardSummary['portfolioSummary'];
}

export function BigNumbersCard({ summary }: BigNumbersCardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const items = [
    { title: 'Patrimônio Líquido Real', value: summary.patrimonioLiquidoReal, icon: <Wallet className="h-4 w-4" />, color: 'text-green-600' },
    { title: 'Caixa', value: summary.caixa, icon: <Building2 className="h-4 w-4" />, color: 'text-blue-600' },
    { title: 'Total Investido', value: summary.investido, icon: <TrendingUp className="h-4 w-4" />, color: 'text-gray-600' },
    { title: 'Impostos a Pagar', value: summary.impostosAPagar, icon: <Receipt className="h-4 w-4" />, color: 'text-red-600' },
    { title: 'Retorno Total %', value: summary.retornoTotalPercentual, icon: <Gauge className="h-4 w-4" />, color: summary.retornoTotalPercentual >= 0 ? 'text-green-600' : 'text-red-600', isPercent: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.isPercent 
                ? `${item.value.toFixed(2)}%` 
                : formatCurrency(item.value)
              }
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}