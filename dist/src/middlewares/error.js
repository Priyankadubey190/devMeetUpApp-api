"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config/config"));
const apiError_1 = require("../utils/apiError");
const loggerHelper_1 = __importDefault(require("../utils/loggerHelper"));
class ErrorHandler {
    errorConverter(err, _req, _res, next) {
        let error = err;
        if (!(error instanceof apiError_1.ApiError)) {
            const statusCode = error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
            const message = error.message || http_status_1.default[statusCode];
            error = new apiError_1.ApiError(statusCode, message, undefined, false);
        }
        next(error);
    }
    errorHandler(err, req, res, _next) {
        let statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
        let message = err.message || "Internal Server Error";
        if (config_1.default.env === "production" && !err.isOperational) {
            statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
            message = "Something went wrong";
        }
        loggerHelper_1.default.logError("GLOBAL_ERROR", err, {
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
        }, "system", true);
        res.status(statusCode).json(Object.assign({ success: false, code: statusCode, message }, (config_1.default.env === "development" && { stack: err.stack })));
    }
}
exports.ErrorHandler = ErrorHandler;
