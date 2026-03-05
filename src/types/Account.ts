import type { AccountType } from "../enums/AccountType.ts";

export interface Account {
  accountId: string;
  accountType: AccountType;
  optionsLevel?: string;
  brokerageAccountType?: string;
  tradePermissions?: string;
}
