import type { Instrument } from "./Instrument.ts";
import type { OrderSide } from "../enums/OrderSide.ts";
import type { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";

export interface OrderLegRequest {
  instrument: Instrument;
  side: OrderSide;
  openCloseIndicator?: OpenCloseIndicator;
  ratioQuantity?: number;
}
