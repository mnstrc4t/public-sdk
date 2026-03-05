import type { LegInstrument } from "./LegInstrument.ts";
import type { OrderSide } from "../enums/OrderSide.ts";
import type { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";

export interface OrderLegRequest {
  instrument: LegInstrument;
  side: OrderSide;
  openCloseIndicator?: OpenCloseIndicator;
  ratioQuantity?: number;
}
