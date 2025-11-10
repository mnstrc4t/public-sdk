import { createHttpClient, type HttpClient } from "./http.ts";
import { createOAuthAuth } from "./oauth.ts";
import type { Account } from "./types/Account.ts";
import type { HistoryRequest } from "./types/HistoryRequest.ts";
import type { Instrument } from "./types/Instrument.ts";
import type { InstrumentsRequest } from "./types/InstrumentsRequest.ts";
import type { MultilegOrderRequest } from "./types/MultilegOrderRequest.ts";
import type { OptionChainRequest } from "./types/OptionChainRequest.ts";
import type { OptionExpirationsRequest } from "./types/OptionExpirationsRequest.ts";
import type { Order } from "./types/Order.ts";
import type { OrderInstrument } from "./types/OrderInstrument.ts";
import type { OrderRequest } from "./types/OrderRequest.ts";
import type { PreflightMultiLegRequest } from "./types/PreflightMultiLegRequest.ts";
import type { PreflightRequest } from "./types/PreflightRequest.ts";
import type { Quote } from "./types/Quote.ts";

interface ApiKeyAuth {
  getToken: () => Promise<string>;
  revoke: () => void;
}

function createApiKeyAuth(
  client: HttpClient,
  secretKey: string,
  validityMinutes = 15
): ApiKeyAuth {
  if (validityMinutes < 5 || validityMinutes > 1440) {
    throw new Error("Validity must be between 5 and 1440 minutes");
  }

  let token: string | null = null;
  let expiresAt: number | null = null;

  const isValid = () => token && expiresAt && Date.now() < expiresAt;

  const refresh = async () => {
    const response = (await client.post(
      "/userapiauthservice/personal/access-tokens",
      {
        secret: secretKey,
        validityInMinutes: validityMinutes,
      }
    )) as { accessToken?: string };

    token = response.accessToken ?? null;
    if (token) {
      expiresAt = Date.now() + (validityMinutes - 5) * 60 * 1000;
      client.setAuthHeader(token);
    }
  };

  return {
    getToken: async () => {
      if (!isValid()) await refresh();
      return token ?? "";
    },
    revoke: () => {
      token = null;
      expiresAt = null;
      client.removeAuthHeader();
    },
  };
}

function createApiClient(http: HttpClient, config: { accountId?: string }) {
  const requireAccountId = (acctId?: string) => {
    const id = acctId ?? config.accountId;
    if (!id) throw new Error("Account ID required");
    return id;
  };

  const toParams = (obj: Record<string, unknown>) => {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val == null) continue;
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      if (Array.isArray(val)) {
        result[camelKey] = val.map((v) =>
          typeof v === "object" && v !== null
            ? toParams(v as Record<string, unknown>)
            : v
        );
      } else if (typeof val === "object" && !(val instanceof Date)) {
        result[camelKey] = toParams(val as Record<string, unknown>);
      } else {
        result[camelKey] = val;
      }
    }
    return result;
  };

  return {
    getAccounts: async () => {
      const res = await http.get("userapigateway/trading/account");
      return (res as { accounts: Account[] }).accounts;
    },

    getPortfolio: (acctId?: string) => {
      const id = requireAccountId(acctId);
      return http.get(`userapigateway/trading/${id}/portfolio/v2`);
    },

    getHistory: (request?: HistoryRequest, acctId?: string) => {
      const id = requireAccountId(acctId);
      const params = request
        ? toParams(request as Record<string, unknown>)
        : undefined;
      return http.get(`userapigateway/trading/${id}/history`, params);
    },

    getAllInstruments: (request?: InstrumentsRequest) => {
      const params = request
        ? toParams(request as Record<string, unknown>)
        : undefined;
      return http.get("userapigateway/trading/instruments", params);
    },

    getInstrument: async (symbol: string, type: string) => {
      const res = await http.get(
        `userapigateway/trading/instruments/${symbol}/${type}`
      );
      return res as unknown as Instrument;
    },

    getQuotes: async (instruments: OrderInstrument[], acctId?: string) => {
      const id = requireAccountId(acctId);
      const res = await http.post(`userapigateway/marketdata/${id}/quotes`, {
        instruments: instruments.map((i) => ({
          symbol: i.symbol,
          type: i.type,
        })),
      });
      return ((res as { quotes?: Quote[] }).quotes ?? []) as Quote[];
    },

    getOptionExpirations: (
      request: OptionExpirationsRequest,
      acctId?: string
    ) => {
      const id = requireAccountId(acctId);
      return http.post(
        `userapigateway/marketdata/${id}/option-expirations`,
        toParams(request as unknown as Record<string, unknown>)
      );
    },

    getOptionChain: (request: OptionChainRequest, acctId?: string) => {
      const id = requireAccountId(acctId);
      return http.post(
        `userapigateway/marketdata/${id}/option-chain`,
        toParams(request as unknown as Record<string, unknown>)
      );
    },

    getOptionGreeks: (osiSymbol: string, acctId?: string) => {
      const id = requireAccountId(acctId);
      return http.get(
        `userapigateway/option-details/${id}/${osiSymbol}/greeks`
      );
    },

    preflightOrder: (request: PreflightRequest, acctId?: string) => {
      const id = requireAccountId(acctId);
      return http.post(
        `userapigateway/trading/${id}/preflight/single-leg`,
        toParams(request as unknown as Record<string, unknown>)
      );
    },

    preflightMultiLeg: (request: PreflightMultiLegRequest, acctId?: string) => {
      const id = requireAccountId(acctId);
      return http.post(
        `userapigateway/trading/${id}/preflight/multi-leg`,
        toParams(request as unknown as Record<string, unknown>)
      );
    },

    placeOrder: async (request: OrderRequest, acctId?: string) => {
      const id = requireAccountId(acctId);
      const res = await http.post(
        `userapigateway/trading/${id}/order`,
        toParams(request as unknown as Record<string, unknown>)
      );
      return (res as { orderId: string }).orderId;
    },

    placeMultiLegOrder: async (
      request: MultilegOrderRequest,
      acctId?: string
    ) => {
      const id = requireAccountId(acctId);
      const res = await http.post(
        `userapigateway/trading/${id}/order/multileg`,
        toParams(request as unknown as Record<string, unknown>)
      );
      return (res as { orderId: string }).orderId;
    },

    getOrder: async (orderId: string, acctId?: string) => {
      const id = requireAccountId(acctId);
      const res = await http.get(
        `userapigateway/trading/${id}/order/${orderId}`
      );
      return res as unknown as Order;
    },

    cancelOrder: (orderId: string, acctId?: string) => {
      const id = requireAccountId(acctId);
      return http.delete(`userapigateway/trading/${id}/order/${orderId}`);
    },
  };
}

export function createClient(config: {
  baseUrl?: string;
  accountId?: string;
  timeout?: number;
  maxRetries?: number;
  retryBackoff?: number;
  maxRetryTimeout?: number;
  auth:
    | { apiKey: string; validityMinutes?: number }
    | {
        oauth: {
          clientId: string;
          redirectUri: string;
          clientSecret?: string;
          scope?: string;
        };
      };
}) {
  const http = createHttpClient({
    baseUrl: config.baseUrl ?? "https://api.public.com",
    timeout: config.timeout,
    maxRetries: config.maxRetries,
    retryBackoff: config.retryBackoff,
    maxRetryTimeout: config.maxRetryTimeout,
  });

  const auth =
    "apiKey" in config.auth
      ? createApiKeyAuth(http, config.auth.apiKey, config.auth.validityMinutes)
      : createOAuthAuth(http, config.auth.oauth);

  const api = createApiClient(http, { accountId: config.accountId });

  const withAuth = <T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T
  ) => {
    return async (...args: Parameters<T>) => {
      await auth.getToken();
      return fn(...args);
    };
  };

  return {
    getAccounts: withAuth(api.getAccounts),
    getPortfolio: withAuth(api.getPortfolio),
    getHistory: withAuth(api.getHistory),
    getAllInstruments: withAuth(api.getAllInstruments),
    getInstrument: withAuth(api.getInstrument),
    getQuotes: withAuth(api.getQuotes),
    getOptionExpirations: withAuth(api.getOptionExpirations),
    getOptionChain: withAuth(api.getOptionChain),
    getOptionGreeks: withAuth(api.getOptionGreeks),
    preflightOrder: withAuth(api.preflightOrder),
    preflightMultiLeg: withAuth(api.preflightMultiLeg),
    placeOrder: withAuth(api.placeOrder),
    placeMultiLegOrder: withAuth(api.placeMultiLegOrder),
    getOrder: withAuth(api.getOrder),
    cancelOrder: withAuth(api.cancelOrder),
    auth: { revoke: () => auth.revoke() },
  };
}
