import { OrderInstrument } from "./OrderInstrument.ts";

export interface OptionChainRequest {
  instrument: OrderInstrument;
  expirationDate: string;
}

