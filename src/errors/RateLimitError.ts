import { APIError } from "./APIError.ts";

export class RateLimitError extends APIError {
  constructor(
    message = "Rate limit exceeded",
    statusCode = 429,
    public retryAfter?: number,
    responseData?: Record<string, unknown>,
  ) {
    super(message, statusCode, responseData);
    this.name = "RateLimitError";
  }
}

