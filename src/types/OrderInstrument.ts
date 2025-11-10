import { InstrumentType } from "../enums/InstrumentType.ts";

export interface OrderInstrument {
  symbol: string;
  type: InstrumentType;
}

