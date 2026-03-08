import type { Instrument } from "./Instrument.ts";
import type { OrderSide } from "../enums/OrderSide.ts";
import type { OrderType } from "../enums/OrderType.ts";
import type { OrderExpirationRequest } from "./OrderExpirationRequest.ts";
import type { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";
import type { EquityMarketSession } from "../enums/EquityMarketSession.ts";

export interface OrderRequest {
  orderId: string;
  instrument: Instrument;
  orderSide: OrderSide;
  orderType: OrderType;
  expiration: OrderExpirationRequest;
  quantity?: number;
  amount?: string;
  limitPrice?: string;
  stopPrice?: string;
  openCloseIndicator?: OpenCloseIndicator;
  equityMarketSession?: EquityMarketSession;
}
