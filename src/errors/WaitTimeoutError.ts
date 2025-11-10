export class WaitTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WaitTimeoutError";
  }
}

