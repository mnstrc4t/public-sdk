import type { OrderInstrument } from "./OrderInstrument.ts";
import type { QuoteOutcome } from "../enums/QuoteOutcome.ts";

export interface Quote {
  instrument: OrderInstrument;
  outcome: QuoteOutcome;
  last?: string;
  lastTimestamp?: string;
  bid?: string;
  bidSize?: number;
  bidTimestamp?: string;
  ask?: string;
  askSize?: number;
  askTimestamp?: string;
  volume?: number;
  openInterest?: number;
}
