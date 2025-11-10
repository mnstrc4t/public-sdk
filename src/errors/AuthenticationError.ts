import { APIError } from "./APIError.ts";

export class AuthenticationError extends APIError {
  constructor(
    message = "Authentication failed",
    statusCode = 401,
    responseData?: Record<string, unknown>,
  ) {
    super(message, statusCode, responseData);
    this.name = "AuthenticationError";
  }
}

