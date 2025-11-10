export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseData?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "APIError";
  }
}

