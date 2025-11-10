import { retry } from "@std/async/retry";
import {
  APIError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from "./errors/mod.ts";

const VERSION = "0.1.2";

interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  maxRetries?: number;
  retryBackoff?: number;
  maxRetryTimeout?: number;
}

export function createHttpClient(config: HttpClientConfig) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "User-Agent": `public-deno-sdk/${VERSION}`,
    "X-App-Version": `public-deno-sdk/${VERSION}`,
    ...config.headers,
  });

  const timeout = config.timeout ?? 30000;
  const baseUrl = config.baseUrl.replace(/\/$/, "");
  const maxRetries = config.maxRetries ?? 3;
  const minTimeout = config.retryBackoff ?? 300;
  const maxTimeout = config.maxRetryTimeout ?? 15000;

  async function request(
    method: string,
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Record<string, unknown>> {
    const url = `${baseUrl}/${endpoint.replace(/^\//, "")}`;
    const isRetryableMethod = ["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());

    const makeRequest = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method,
          headers,
          signal: controller.signal,
          ...options,
        });

        let data: Record<string, unknown> = {};
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          try {
            data = await response.json();
          } catch {
            // ignore
          }
        } else if (response.body) {
          data = { rawContent: await response.text() };
        }

        if (!response.ok) {
          const message = typeof data.message === "string" ? data.message : "Unknown error";

          if (response.status === 401) throw new AuthenticationError(message, response.status, data);
          if (response.status === 400) throw new ValidationError(message, response.status, data);
          if (response.status === 404) throw new NotFoundError(message, response.status, data);
          if (response.status === 429) {
            const retryAfter = response.headers.get("Retry-After");
            throw new RateLimitError(
              message,
              response.status,
              retryAfter ? parseInt(retryAfter) : undefined,
              data,
            );
          }
          if (response.status >= 500) throw new ServerError(message, response.status, data);
          throw new APIError(message, response.status, data);
        }

        return data;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Only retry safe methods with retryable errors (429, 500+)
    if (isRetryableMethod && maxRetries > 0) {
      return retry(makeRequest, {
        maxAttempts: maxRetries + 1,
        minTimeout,
        maxTimeout,
        multiplier: 2,
        jitter: 1,
      });
    }

    return makeRequest();
  }

  return {
    setAuthHeader: (token: string) => headers.set("Authorization", `Bearer ${token}`),
    removeAuthHeader: () => headers.delete("Authorization"),
    get: (endpoint: string, params?: Record<string, unknown>) => {
      let url = endpoint;
      if (params) {
        const search = new URLSearchParams();
        for (const [k, v] of Object.entries(params)) {
          if (v != null) search.append(k, String(v));
        }
        const query = search.toString();
        if (query) url += `?${query}`;
      }
      return request("GET", url);
    },
    post: (endpoint: string, data?: Record<string, unknown>) =>
      request("POST", endpoint, { body: data ? JSON.stringify(data) : undefined }),
    put: (endpoint: string, data?: Record<string, unknown>) =>
      request("PUT", endpoint, { body: data ? JSON.stringify(data) : undefined }),
    delete: (endpoint: string) => request("DELETE", endpoint),
  };
}

export type HttpClient = ReturnType<typeof createHttpClient>;

