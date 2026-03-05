import type { TimeInForce } from "../enums/TimeInForce.ts";

export interface OrderExpirationRequest {
  timeInForce: TimeInForce;
  expirationTime?: string;
}
