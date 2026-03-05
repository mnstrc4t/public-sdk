export interface Greeks {
  delta: string;
  gamma: string;
  theta: string;
  vega: string;
  rho: string;
  impliedVolatility: string;
}

export interface OptionGreek {
  symbol: string;
  greeks: Greeks;
}

export interface OptionGreeksResponse {
  greeks: OptionGreek[];
}

