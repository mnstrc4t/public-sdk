import { OrderInstrument } from "./OrderInstrument.ts";
import { QuoteOutcome } from "../enums/QuoteOutcome.ts";

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

