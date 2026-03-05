import type { OrderInstrument } from "./OrderInstrument.ts";
import type { OrderSide } from "../enums/OrderSide.ts";
import type { OrderType } from "../enums/OrderType.ts";
import type { OrderExpirationRequest } from "./OrderExpirationRequest.ts";
import type { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";

export interface PreflightRequest {
  instrument: OrderInstrument;
  orderSide: OrderSide;
  orderType: OrderType;
  expiration: OrderExpirationRequest;
  quantity?: number;
  amount?: string;
  limitPrice?: string;
  stopPrice?: string;
  openCloseIndicator?: OpenCloseIndicator;
}
