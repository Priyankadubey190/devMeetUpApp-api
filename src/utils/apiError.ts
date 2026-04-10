/* eslint-disable @typescript-eslint/no-explicit-any */

export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public data?: any;

  constructor(
    statusCode: number,
    message: string,
    data?: any,
    isOperational = true,
  ) {
    super(message);

    Object.setPrototypeOf(this, ApiError.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
