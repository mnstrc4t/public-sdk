import type { LegInstrumentType } from "../enums/LegInstrumentType.ts";

export interface LegInstrument {
  symbol: string;
  type: LegInstrumentType;
}
