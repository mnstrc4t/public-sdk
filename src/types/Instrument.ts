import type { InstrumentType } from "../enums/InstrumentType.ts";

export interface Instrument {
  symbol: string;
  type: InstrumentType;
}
