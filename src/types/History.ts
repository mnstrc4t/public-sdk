export interface HistoryTransaction {
  id: string;
  timestamp: string;
  type: string;
  subType: string;
  accountNumber: string;
  symbol?: string;
  securityType?: string;
  side?: string;
  description: string;
  netAmount: string;
  principalAmount?: string;
  quantity?: string;
  direction: string;
  fees: string;
}

export interface History {
  transactions: HistoryTransaction[];
  nextToken?: string;
  start: string;
  end: string;
  pageSize: number;
}
