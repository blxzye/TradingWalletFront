'use client';

import React, { useState } from 'react';
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';

// Dados percentuais (rentabilidade)
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

// Rentabilidade mensal do portfólio (%)
const monthlyReturns: Record<number, number[]> = {
  2026: [1.2, 0.8, 1.5, 2.0, 1.1, 0.9, 1.3, 1.7, 1.4, 1.0, 1.2, 1.6],
  2025: [0.9, 1.1, 1.3, 1.8, 1.0, 1.2, 1.5, 1.9, 1.6, 1.2, 1.4, 1.7],
  2024: [1.0, 0.7, 1.2, 1.5, 0.8, 1.1, 1.4, 1.6, 1.3, 0.9, 1.1, 1.4],
  2023: [0.8, 0.9, 1.1, 1.3, 0.7, 0.9, 1.2, 1.4, 1.0, 0.8, 1.0, 1.2],
  2022: [0.7, 0.6, 0.9, 1.2, 0.6, 0.8, 1.0, 1.3, 0.9, 0.7, 0.9, 1.1],
};

// Rentabilidade mensal do CDI (%)
const cdiMonthlyReturns: Record<number, number[]> = {
  2026: [0.8, 0.5, 1.0, 1.3, 0.7, 0.6, 0.9, 1.1, 0.9, 0.7, 0.8, 1.0],
  2025: [0.6, 0.8, 0.9, 1.2, 0.7, 0.8, 1.0, 1.3, 1.1, 0.8, 0.9, 1.1],
  2024: [0.7, 0.5, 0.8, 1.0, 0.6, 0.7, 0.9, 1.1, 0.8, 0.6, 0.7, 0.9],
  2023: [0.5, 0.6, 0.7, 0.9, 0.5, 0.6, 0.8, 1.0, 0.7, 0.5, 0.7, 0.8],
  2022: [0.4, 0.4, 0.6, 0.8, 0.4, 0.5, 0.7, 0.9, 0.6, 0.4, 0.6, 0.7],
};

// Dados monetários (R$)
const moneyData = {
  portfolio: {
    month: 1250,
    year: 8450,
    twelveMonths: 12300,
    twentyFourMonths: 22150,
    sinceInception: 34500,
  },
  cdi: {
    month: 820,
    year: 6100,
    twelveMonths: 9450,
    twentyFourMonths: 18200,
    sinceInception: 27800,
  },
};

const monthlyMoney: Record<number, number[]> = {
  2026: [1200, 800, 1500, 2000, 1100, 900, 1300, 1700, 1400, 1000, 1200, 1600],
  2025: [900, 1100, 1300, 1800, 1000, 1200, 1500, 1900, 1600, 1200, 1400, 1700],
  2024: [1000, 700, 1200, 1500, 800, 1100, 1400, 1600, 1300, 900, 1100, 1400],
  2023: [800, 900, 1100, 1300, 700, 900, 1200, 1400, 1000, 800, 1000, 1200],
  2022: [700, 600, 900, 1200, 600, 800, 1000, 1300, 900, 700, 900, 1100],
};

const cdiMonthlyMoney: Record<number, number[]> = {
  2026: [800, 500, 1000, 1300, 700, 600, 900, 1100, 900, 700, 800, 1000],
  2025: [600, 800, 900, 1200, 700, 800, 1000, 1300, 1100, 800, 900, 1100],
  2024: [700, 500, 800, 1000, 600, 700, 900, 1100, 800, 600, 700, 900],
  2023: [500, 600, 700, 900, 500, 600, 800, 1000, 700, 500, 700, 800],
  2022: [400, 400, 600, 800, 400, 500, 700, 900, 600, 400, 600, 700],
};

const monthsAbbr = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function ReturnsComparisonTable() {
  const [viewMode, setViewMode] = useState<'percentage' | 'money'>('percentage');
  const [showAllYears, setShowAllYears] = useState(false);

  const formatPercent = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const currentReturns = viewMode === 'percentage' ? returnsData : moneyData;
  const currentMonthly = viewMode === 'percentage' ? monthlyReturns : monthlyMoney;
  const currentCdiMonthly = viewMode === 'percentage' ? cdiMonthlyReturns : cdiMonthlyMoney;

  // Obtém a lista de anos ordenada decrescente (mais recente primeiro)
  const allYears = Object.keys(currentMonthly)
    .map(Number)
    .sort((a, b) => b - a);
  const displayedYears = showAllYears ? allYears : allYears.slice(0, 3);

  const hasMoreYears = allYears.length > 3;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold">Resultado Financeiro e Rentabilidade</CardTitle>
          <ToggleGroup
            variant="outline"
            type="single"
            value={viewMode}
            onValueChange={(val) => val && setViewMode(val as 'percentage' | 'money')}
          >
            <ToggleGroupItem value="percentage" aria-label="Rentabilidade" className='cursor-pointer'>
              Rentabilidade
            </ToggleGroupItem>
            <ToggleGroupItem value="money" aria-label="Retorno (R$)" className='cursor-pointer'>
              Retorno (R$)
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        {/* Primeira tabela - comparação carteira vs CDI */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b">
                <TableHead className="w-32 font-bold text-muted-foreground px-6" />
                <TableHead className="text-right font-bold text-muted-foreground px-6">Período</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground px-6">Mês</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground px-6">Ano</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground px-6">12 Meses</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground px-6">24 Meses</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground px-6">Desde o início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold px-6">Portfólio</TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.portfolio.sinceInception)
                    : formatMoney(currentReturns.portfolio.sinceInception)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.portfolio.month)
                    : formatMoney(currentReturns.portfolio.month)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.portfolio.year)
                    : formatMoney(currentReturns.portfolio.year)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.portfolio.twelveMonths)
                    : formatMoney(currentReturns.portfolio.twelveMonths)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.portfolio.twentyFourMonths)
                    : formatMoney(currentReturns.portfolio.twentyFourMonths)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.portfolio.sinceInception)
                    : formatMoney(currentReturns.portfolio.sinceInception)}
                </TableCell>
              </TableRow>
              <TableRow className="!border-b border-border">
                <TableCell className="font-medium px-6">CDI</TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.cdi.sinceInception)
                    : formatMoney(currentReturns.cdi.sinceInception)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.cdi.month)
                    : formatMoney(currentReturns.cdi.month)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.cdi.year)
                    : formatMoney(currentReturns.cdi.year)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.cdi.twelveMonths)
                    : formatMoney(currentReturns.cdi.twelveMonths)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.cdi.twentyFourMonths)
                    : formatMoney(currentReturns.cdi.twentyFourMonths)}
                </TableCell>
                <TableCell className="text-right px-6">
                  {viewMode === 'percentage'
                    ? formatPercent(currentReturns.cdi.sinceInception)
                    : formatMoney(currentReturns.cdi.sinceInception)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Segunda tabela - rentabilidade mensal */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className='border-t'>
                <TableHead className="w-24 font-bold text-muted-foreground px-6">Ano</TableHead>
                {monthsAbbr.map(month => (
                  <TableHead key={month} className="text-right font-bold text-muted-foreground px-6">
                    {month}
                  </TableHead>
                ))}
                <TableHead className="text-right font-bold text-muted-foreground px-6">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedYears.map((year) => {
                const portfolioReturns = currentMonthly[year];
                const cdiReturns = currentCdiMonthly[year];
                const portfolioTotal = portfolioReturns.reduce((a, b) => a + b, 0);
                const cdiTotal = cdiReturns.reduce((a, b) => a + b, 0);
                return (
                  <React.Fragment key={year}>
                    <TableRow>
                      <TableCell className="font-bold px-6">{year}</TableCell>
                      {portfolioReturns.map((value, idx) => (
                        <TableCell key={idx} className="text-right px-6">
                          {viewMode === 'percentage' ? formatPercent(value) : formatMoney(value)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-bold px-6">
                        {viewMode === 'percentage' ? formatPercent(portfolioTotal) : formatMoney(portfolioTotal)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell className="px-6">CDI</TableCell>
                      {cdiReturns.map((value, idx) => (
                        <TableCell key={idx} className="text-right px-6">
                          {viewMode === 'percentage' ? formatPercent(value) : formatMoney(value)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-bold px-6">
                        {viewMode === 'percentage' ? formatPercent(cdiTotal) : formatMoney(cdiTotal)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Botão "Ver mais" como texto sublinhado, com distância reduzida */}
        {hasMoreYears && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowAllYears(!showAllYears)}
              className="text-sm underline text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1 font-bold"
            >
              {showAllYears ? (
                <>
                  <span>Ver menos</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Ver tudo</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}