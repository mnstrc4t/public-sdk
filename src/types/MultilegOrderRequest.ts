import { OrderType } from "../enums/OrderType.ts";
import { OrderExpirationRequest } from "./OrderExpirationRequest.ts";
import { OrderLegRequest } from "./OrderLegRequest.ts";

export interface MultilegOrderRequest {
  orderId: string;
  quantity: number;
  type: OrderType;
  limitPrice?: string;
  expiration: OrderExpirationRequest;
  legs: OrderLegRequest[];
}

