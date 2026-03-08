import type { Instrument } from "./Instrument.ts";
import type { QuoteOutcome } from "../enums/QuoteOutcome.ts";

export interface Quote {
  instrument: Instrument;
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
