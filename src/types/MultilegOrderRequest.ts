import type { OrderType } from "../enums/OrderType.ts";
import type { OrderExpirationRequest } from "./OrderExpirationRequest.ts";
import type { OrderLegRequest } from "./OrderLegRequest.ts";

export interface MultilegOrderRequest {
  orderId: string;
  quantity: number;
  type: OrderType;
  limitPrice?: string;
  expiration: OrderExpirationRequest;
  legs: OrderLegRequest[];
}
