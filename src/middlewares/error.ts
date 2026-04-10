/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import config from "../config/config";
import { ApiError } from "../utils/apiError";
import LoggerHelper from "../utils/loggerHelper";
import type { Request, Response, NextFunction } from "express";

export class ErrorHandler {
  public errorConverter(
    err: any,
    _req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    let error = err;

    if (!(error instanceof ApiError)) {
      const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

      const message =
        error.message || httpStatus[statusCode as keyof typeof httpStatus];

      error = new ApiError(statusCode, message, undefined, false);
    }

    next(error);
  }

  public errorHandler(
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction,
  ): void {
    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message || "Internal Server Error";

    if (config.env === "production" && !err.isOperational) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = "Something went wrong";
    }

    LoggerHelper.logError(
      "GLOBAL_ERROR",
      err,
      {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
      },
      "system",
      true,
    );

    res.status(statusCode).json({
      success: false,
      code: statusCode,
      message,
      ...(config.env === "development" && { stack: err.stack }),
    });
  }
}
