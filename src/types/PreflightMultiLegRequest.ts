import type { OrderType } from "../enums/OrderType.ts";
import type { OrderExpirationRequest } from "./OrderExpirationRequest.ts";
import type { OrderLegRequest } from "./OrderLegRequest.ts";

export interface PreflightMultiLegRequest {
  orderType: OrderType;
  expiration: OrderExpirationRequest;
  quantity?: number;
  limitPrice: string;
  legs: OrderLegRequest[];
}
