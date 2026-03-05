import type { Quote } from "./Quote.ts";

export interface OptionChain {
  baseSymbol: string;
  calls: Quote[];
  puts: Quote[];
}

