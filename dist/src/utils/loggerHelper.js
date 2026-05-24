"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const logger_1 = __importDefault(require("../config/logger"));
const processError = (metaData, error) => {
    var _a, _b, _c;
    if (error instanceof Error) {
        if (error.isAxiosError) {
            metaData.requestData = (_a = error.config) === null || _a === void 0 ? void 0 : _a.data;
            metaData.requestMethod = (_b = error.config) === null || _b === void 0 ? void 0 : _b.method;
            metaData.responseData = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data;
        }
        const newError = new Error(error.message);
        newError.stack = error.stack;
        metaData.error = newError;
        return [newError, metaData];
    }
    return [undefined, metaData];
};
class LoggerHelper {
    static logError(logId, error, data, kind = "custom", saveInDB = true) {
        if (!logId)
            return;
        const metaData = Object.assign({ logId,
            kind,
            saveInDB }, (data && Object.keys(data).length > 0 && { data }));
        try {
            const [logError, logMetadata] = processError(metaData, error);
            const message = logError ? logError.message : `Error occurred in ${kind}`;
            logger_1.default.error(message, logMetadata);
        }
        catch (err) {
            logger_1.default.error("LoggerHelper failed", Object.assign(Object.assign({}, metaData), { error,
                err, saveInDB: true }));
        }
    }
    static logInfo(message, data) {
        logger_1.default.info(message, Object.assign({}, (data && { data })));
    }
    static logWarn(message, data) {
        logger_1.default.warn(message, Object.assign({}, (data && { data })));
    }
}
exports.default = LoggerHelper;
