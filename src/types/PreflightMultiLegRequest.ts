import { OrderType } from "../enums/OrderType.ts";
import { OrderExpirationRequest } from "./OrderExpirationRequest.ts";
import { OrderLegRequest } from "./OrderLegRequest.ts";

export interface PreflightMultiLegRequest {
  orderType: OrderType;
  expiration: OrderExpirationRequest;
  quantity?: number;
  limitPrice: string;
  legs: OrderLegRequest[];
}

