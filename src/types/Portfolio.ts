import type { AccountType } from "../enums/AccountType.ts";
import type { InstrumentType } from "../enums/InstrumentType.ts";
import type { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";
import type { OrderSide } from "../enums/OrderSide.ts";
import type { OrderStatus } from "../enums/OrderStatus.ts";
import type { OrderType } from "../enums/OrderType.ts";
import type { TimeInForce } from "../enums/TimeInForce.ts";

export interface BuyingPower {
  cashOnlyBuyingPower: string;
  buyingPower: string;
  optionsBuyingPower: string;
}

export interface EquityValue {
  type: string;
  value: string;
  percentageOfPortfolio: string;
}

export interface PortfolioInstrument {
  symbol: string;
  name?: string;
  type: InstrumentType;
}

export interface LastPrice {
  lastPrice: string;
  timestamp: string;
}

export interface InstrumentGain {
  gainValue: string;
  gainPercentage: string;
  timestamp: string;
}

export interface PositionDailyGain {
  gainValue: string;
  gainPercentage: string;
  timestamp: string;
}

export interface CostBasis {
  totalCost: string;
  unitCost: string;
  gainValue: string;
  gainPercentage: string;
  lastUpdate: string;
}

export interface Position {
  instrument: PortfolioInstrument;
  quantity: string;
  openedAt: string;
  currentValue: string;
  percentOfPortfolio: string;
  lastPrice: LastPrice;
  instrumentGain: InstrumentGain;
  positionDailyGain: PositionDailyGain;
  costBasis: CostBasis;
}

export interface OrderExpiration {
  timeInForce: TimeInForce;
  expirationTime?: string;
}

export interface OrderLeg {
  instrument: {
    symbol: string;
    type: InstrumentType;
  };
  side: OrderSide;
  openCloseIndicator: OpenCloseIndicator;
  ratioQuantity: number;
}

export interface PortfolioOrder {
  orderId: string;
  instrument: {
    symbol: string;
    type: InstrumentType;
  };
  createdAt: string;
  type: OrderType;
  side: OrderSide;
  status: OrderStatus;
  quantity: string;
  notionalValue?: string;
  expiration: OrderExpiration;
  limitPrice?: string;
  stopPrice?: string;
  closedAt?: string;
  openCloseIndicator?: OpenCloseIndicator;
  filledQuantity?: string;
  averagePrice?: string;
  legs?: OrderLeg[];
  rejectReason?: string;
}

export interface Portfolio {
  accountId: string;
  accountType: AccountType;
  buyingPower: BuyingPower;
  equity: EquityValue[];
  positions: Position[];
  orders: PortfolioOrder[];
}

