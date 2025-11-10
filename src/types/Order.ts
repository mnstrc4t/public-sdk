import { OrderInstrument } from "./OrderInstrument.ts";
import { OrderType } from "../enums/OrderType.ts";
import { OrderSide } from "../enums/OrderSide.ts";
import { OrderStatus } from "../enums/OrderStatus.ts";
import { TimeInForce } from "../enums/TimeInForce.ts";
import { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";
import { LegInstrumentType } from "../enums/LegInstrumentType.ts";

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

