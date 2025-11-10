import { OrderInstrument } from "./OrderInstrument.ts";
import { OrderSide } from "../enums/OrderSide.ts";
import { OrderType } from "../enums/OrderType.ts";
import { OrderExpirationRequest } from "./OrderExpirationRequest.ts";
import { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";

export interface OrderRequest {
  orderId: string;
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

