'use client';

import { useQuery } from '@tanstack/react-query';
import { SectionCards } from '@/components/section-cards';
import { DataTable } from '@/components/data-table';
import { ChartDonutActive } from '@/components/dashboard/ChartDonutActive';
import { ChartBarStacked } from '@/components/ChartBarStacked';
import { api } from '@/lib/api/apiClient';
import { Skeleton } from '@/components/ui/skeleton';

const PORTFOLIO_ID = 'f06740c2-c17b-46c9-8c10-9a472ee6cf53';

interface DashboardData {
  totalNetWorth: string;
  cashBalance: string;
  investedValue: string;
  taxLiabilities: string;
  totalReturnPercent: string;
  assetAllocation: Array<{ category: string; value: string; percent: string }>;
  holdings: Array<{
    ticker: string;
    quantity: string;
    pmr: string;
    currentPrice: string;
    marketValue: string;
    totalReturnPercent: string;
  }>;
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard-summary', PORTFOLIO_ID],
    queryFn: () => api.get(`/portfolios/${PORTFOLIO_ID}/dashboard/summary`).then(res => res.data),
  });

  const metrics = data ? [
    {
      title: 'Patrimônio Líquido',
      value: `R$ ${parseFloat(data.totalNetWorth).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      trend: parseFloat(data.totalReturnPercent) >= 0 ? `+${data.totalReturnPercent}%` : `${data.totalReturnPercent}%`,
    },
    {
      title: 'Caixa',
      value: `R$ ${parseFloat(data.cashBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      trend: '—',
    },
    {
      title: 'Total Investido',
      value: `R$ ${parseFloat(data.investedValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      trend: '—',
    },
    {
      title: 'Retorno Total',
      value: `${parseFloat(data.totalReturnPercent).toFixed(2)}%`,
      trend: parseFloat(data.totalReturnPercent) >= 0 ? '+%' : '-%',
    },
  ] : [];

  const holdingsTableData = data?.holdings.map((holding, idx) => ({
    id: idx + 1,
    header: holding.ticker,
    type: 'Ação',
    status: parseFloat(holding.quantity) > 0 ? 'Ativo' : 'Zerado',
    target: holding.quantity,
    limit: `R$ ${parseFloat(holding.marketValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    reviewer: parseFloat(holding.totalReturnPercent) === Infinity ? '—' : `${parseFloat(holding.totalReturnPercent).toFixed(2)}%`,
  })) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Skeletons dos 4 cards */}
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>

        {/* Skeletons dos gráficos: donut 1/3 + área 2/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>

        {/* Skeleton da tabela */}
        <div className="px-4 lg:px-6">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-6 text-red-600">
        Erro ao carregar os dados. Verifique sua conexão ou tente novamente.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Cards de métricas */}
      <SectionCards metrics={metrics} />

      {/* Grid de gráficos: donut 1/3, área 2/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-6 items-stretch">
        <div className="lg:col-span-1 h-[350px]">
          <ChartDonutActive data={data.assetAllocation} />
        </div>
        <div className="lg:col-span-2 h-[350px]">
          <ChartBarStacked />
        </div>
      </div>

      {/* Tabela de holdings */}
      <DataTable data={holdingsTableData} />
    </div>
  );
}