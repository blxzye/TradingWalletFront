'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BackendDashboardSummary } from '@/types/BackendDashboardSummary';

interface HoldingsTableProps {
  holdings: BackendDashboardSummary['holdings'];
}

const formatCurrency = (value: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value));

const formatPercent = (value: string) => {
  if (value === 'Infinity') return '—';
  const num = parseFloat(value);
  return `${num.toFixed(2)}%`;
};

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">PMR (R$)</TableHead>
            <TableHead className="text-right">Preço Atual (R$)</TableHead>
            <TableHead className="text-right">Valor de Mercado (R$)</TableHead>
            <TableHead className="text-right">Retorno %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((item) => (
            <TableRow key={item.ticker}>
              <TableCell className="font-medium">{item.ticker}</TableCell>
              <TableCell className="text-right">{parseFloat(item.quantity)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.pmr)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.currentPrice)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.marketValue)}</TableCell>
              <TableCell className="text-right">
                <span className={parseFloat(item.totalReturnPercent) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercent(item.totalReturnPercent)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}