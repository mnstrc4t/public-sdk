import type { OrderInstrument } from "./OrderInstrument.ts";
import type { OrderType } from "../enums/OrderType.ts";
import type { OrderSide } from "../enums/OrderSide.ts";
import type { OrderStatus } from "../enums/OrderStatus.ts";
import type { TimeInForce } from "../enums/TimeInForce.ts";
import type { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";
import type { LegInstrumentType } from "../enums/LegInstrumentType.ts";

export interface Order {
  orderId: string;
  instrument: OrderInstrument;
  createdAt?: string;
  type: OrderType;
  side: OrderSide;
  status: OrderStatus;
  quantity?: string;
  notionalValue?: string;
  expiration?: { timeInForce: TimeInForce; expirationTime?: string };
  limitPrice?: string;
  stopPrice?: string;
  closedAt?: string;
  openCloseIndicator?: OpenCloseIndicator;
  filledQuantity?: string;
  averagePrice?: string;
  legs?: Array<{
    instrument: { symbol: string; type: LegInstrumentType };
    side: OrderSide;
    openCloseIndicator?: OpenCloseIndicator;
    ratioQuantity?: number;
  }>;
  rejectReason?: string;
}
