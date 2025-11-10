import type { InstrumentType } from "../enums/InstrumentType.ts";
import type { Trading } from "../enums/Trading.ts";

export interface InstrumentsRequest {
  typeFilter?: InstrumentType[];
  tradingFilter?: Trading[];
  fractionalTradingFilter?: Trading[];
  optionTradingFilter?: Trading[];
  optionSpreadTradingFilter?: Trading[];
}
