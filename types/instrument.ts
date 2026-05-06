export interface Instrument {
  id: string;
  ticker: string;
  name: string;
  category: "STOCK" | "FII" | "CRYPTO" | "BOND" | "CASH";
  currency: "BRL" | "USD";
}