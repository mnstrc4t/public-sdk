import { APIError } from "./APIError.ts";

export class ValidationError extends APIError {
  constructor(
    message = "Request validation failed",
    statusCode = 400,
    responseData?: Record<string, unknown>,
  ) {
    super(message, statusCode, responseData);
    this.name = "ValidationError";
  }
}

