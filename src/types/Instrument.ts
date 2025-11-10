import type { OrderInstrument } from "./OrderInstrument.ts";
import type { Trading } from "../enums/Trading.ts";

export interface Instrument {
  instrument: OrderInstrument;
  trading: Trading;
  fractionalTrading: Trading;
  optionTrading: Trading;
  optionSpreadTrading: Trading;
}

