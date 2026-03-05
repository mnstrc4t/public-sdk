// parse OSI contract symbol
// format: SYMBOLYYMMDDCPPPPPPPPP
// example: AAPL  250117C00150000 = AAPL Call $150.00 expiring 2025-01-17
// example: QQQ251204C00500000 = QQQ Call $500.00 expiring 2025-12-04
export function parseOSI(symbol: string): {
  readonly symbol: string;
  readonly underlying: string;
  readonly expiration: string;
  readonly type: "C" | "P";
  readonly strike: number;
} | null {
  // OSI format: underlying (1-6 chars, may be padded with spaces) + 6 chars date (YYMMDD) + 1 char type (C/P) + 8 chars strike
  // Match: underlying symbol, then exactly 15 chars for date+type+strike
  const input = symbol.replace("-OPTION", "");
  const match = input.match(/^([A-Z\s]{1,6})(\d{6})([CP])(\d{8})$/);

  if (!match) {
    return null;
  }

  const [, underlying, dateStr, optionType, strikeStr] = match;

  // Parse strike: 5 digits before decimal, 3 after
  // e.g., "00150000" = 150.000 or "00500000" = 500.000
  const strike = parseInt(strikeStr, 10) / 1000;

  // Parse date: YYMMDD
  const year = 2000 + parseInt(dateStr.substring(0, 2), 10);
  const month = dateStr.substring(2, 4);
  const day = dateStr.substring(4, 6);
  const expiration = `${year}-${month}-${day}`;

  return {
    symbol: input,
    underlying: underlying.trim(),
    expiration,
    type: optionType as "C" | "P",
    strike,
  } as const;
}

export type OSIContract = ReturnType<typeof parseOSI>;
