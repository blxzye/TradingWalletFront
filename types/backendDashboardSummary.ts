export interface BackendDashboardSummary {
  totalNetWorth: string;      // "53000.00"
  cashBalance: string;
  investedValue: string;
  taxLiabilities: string;
  totalReturnPercent: string; // "6.00"
  assetAllocation: Array<{
    category: string;         // "CASH", "STOCK", etc.
    value: string;
    percent: string;
  }>;
  topOpportunities: Array<{
    ticker: string;
    currentPrice: string;
    p10: string;
    distancePercent: string;
    signal: string;           // "BUY", "WATCH", etc.
  }>;
  holdings: Array<{
    ticker: string;
    quantity: string;
    pmr: string;
    currentPrice: string;
    marketValue: string;
    totalReturnPercent: string; // pode ser "Infinity"
  }>;
}