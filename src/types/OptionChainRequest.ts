import type { Instrument } from "./Instrument.ts";

export interface OptionChainRequest {
  instrument: Instrument;
  expirationDate: string;
}
