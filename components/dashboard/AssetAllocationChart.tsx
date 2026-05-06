'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BackendDashboardSummary } from '@/types/backendDashboardSummary';

interface AssetAllocationChartProps {
  data: BackendDashboardSummary['assetAllocation'];
}

const COLORS: Record<string, string> = {
  STOCK: '#3b82f6',
  FII: '#10b981',
  CASH: '#f59e0b',
  CRYPTO: '#8b5cf6',
  BOND: '#ef4444',
};

export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  // Converte os dados do backend para o formato do gráfico
  const chartData = data.map((item) => ({
    name: item.category,                 // campo correto: category
    value: parseFloat(item.value),       // converte string para número
    percentual: parseFloat(item.percent), // converte string para número
  }));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{entry.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(entry.value)} ({entry.percentual.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => `${entry.name} ${entry.percentual.toFixed(1)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alocação por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={renderLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#9ca3af'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}