import type { Instrument } from "./Instrument.ts";
import type { Trading } from "../enums/Trading.ts";

export interface InstrumentDetails {
  instrument: Instrument;
  trading: Trading;
  fractionalTrading: Trading;
  optionTrading: Trading;
  optionSpreadTrading: Trading;
}

