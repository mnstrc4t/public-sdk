export interface PollingConfig {
  intervalSeconds?: number;
  retryOnError?: boolean;
  maxRetries?: number;
  exponentialBackoff?: boolean;
}

