import { APIError } from "./APIError.ts";

export class ServerError extends APIError {
  constructor(
    message = "Internal server error",
    statusCode = 500,
    responseData?: Record<string, unknown>,
  ) {
    super(message, statusCode, responseData);
    this.name = "ServerError";
  }
}

