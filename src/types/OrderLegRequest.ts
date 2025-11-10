import { LegInstrument } from "./LegInstrument.ts";
import { OrderSide } from "../enums/OrderSide.ts";
import { OpenCloseIndicator } from "../enums/OpenCloseIndicator.ts";

export interface OrderLegRequest {
  instrument: LegInstrument;
  side: OrderSide;
  openCloseIndicator?: OpenCloseIndicator;
  ratioQuantity?: number;
}

