import { APIError } from "./APIError.ts";

export class NotFoundError extends APIError {
  constructor(
    message = "Resource not found",
    statusCode = 404,
    responseData?: Record<string, unknown>,
  ) {
    super(message, statusCode, responseData);
    this.name = "NotFoundError";
  }
}

