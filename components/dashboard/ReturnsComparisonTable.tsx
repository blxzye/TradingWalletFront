'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const returnsData = {
  portfolio: {
    month: 1.25,
    year: 8.45,
    twelveMonths: 12.30,
    twentyFourMonths: 22.15,
    sinceInception: 34.50,
  },
  cdi: {
    month: 0.82,
    year: 6.10,
    twelveMonths: 9.45,
    twentyFourMonths: 18.20,
    sinceInception: 27.80,
  },
};

const monthlyReturns = {
  2026: [1.2, 0.8, 1.5, 2.0, 1.1, 0.9, 1.3, 1.7, 1.4, 1.0, 1.2, 1.6],
  2025: [0.9, 1.1, 1.3, 1.8, 1.0, 1.2, 1.5, 1.9, 1.6, 1.2, 1.4, 1.7],
  2024: [1.0, 0.7, 1.2, 1.5, 0.8, 1.1, 1.4, 1.6, 1.3, 0.9, 1.1, 1.4],
};

const monthsAbbr = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function ReturnsComparisonTable() {
  const formatPercent = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bold">Resultado Financeiro e Rentabilidade</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b">
                <TableHead className="w-32 font-bold text-muted-foreground" />
                <TableHead className="text-right font-bold text-muted-foreground">Período</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground">Mês</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground">Ano</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground">12 Meses</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground">24 Meses</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground">Desde o início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Portfólio</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.portfolio.sinceInception)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.portfolio.month)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.portfolio.year)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.portfolio.twelveMonths)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.portfolio.twentyFourMonths)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.portfolio.sinceInception)}</TableCell>
              </TableRow>
              <TableRow className="!border-b border-border">
                <TableCell className="font-medium">CDI</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.cdi.sinceInception)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.cdi.month)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.cdi.year)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.cdi.twelveMonths)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.cdi.twentyFourMonths)}</TableCell>
                <TableCell className="text-right">{formatPercent(returnsData.cdi.sinceInception)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className='border-t'>
                <TableHead className="w-24 font-bold text-muted-foreground">Ano</TableHead>
                {monthsAbbr.map(month => (
                  <TableHead key={month} className="text-right font-bold text-muted-foreground">
                    {month}
                  </TableHead>
                ))}
                <TableHead className="text-right font-bold text-muted-foreground">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(monthlyReturns).map(([year, returns]) => {
                const total = returns.reduce((acc, val) => acc + val, 0);
                return (
                  <TableRow key={year}>
                    <TableCell className="font-bold">{year}</TableCell>
                    {returns.map((value, idx) => (
                      <TableCell key={idx} className="text-right">
                        {formatPercent(value)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-bold">
                      {formatPercent(total)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}