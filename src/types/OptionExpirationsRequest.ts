import type { OrderInstrument } from "./OrderInstrument.ts";

export interface OptionExpirationsRequest {
  instrument: OrderInstrument;
}
