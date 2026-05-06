export type OperationType = "BUY" | "SELL" | "DIVIDEND" | "TAX";

export interface Operation {
  id: string;
  portfolioId: string;
  instrumentId: string;
  type: OperationType;
  quantity: number;
  unitPrice: number;          
  grossValue: number;         
  executedAt: Date;           
  createdAt: Date;
  updatedAt: Date;
}