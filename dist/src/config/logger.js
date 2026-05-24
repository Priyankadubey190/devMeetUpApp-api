"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const winston_1 = __importDefault(require("winston"));
require("winston-mongodb");
const config_1 = __importDefault(require("./config"));
const enumerateErrorFormat = winston_1.default.format((info) => {
    if (info instanceof Error) {
        return Object.assign(Object.assign({}, info), { message: info.stack || info.message });
    }
    return info;
});
const mongoDBFilter = winston_1.default.format((info) => {
    var _a;
    if ((_a = info === null || info === void 0 ? void 0 : info.metadata) === null || _a === void 0 ? void 0 : _a.saveInDB) {
        return info;
    }
    return false;
});
const logger = winston_1.default.createLogger({
    level: config_1.default.env === "development" ? "debug" : "info",
    format: winston_1.default.format.combine(enumerateErrorFormat(), config_1.default.env === "development"
        ? winston_1.default.format.colorize()
        : winston_1.default.format.uncolorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp, metadata }) => {
        return `${timestamp} [${level}]: ${message} ${metadata ? JSON.stringify(metadata) : ""}`;
    }), winston_1.default.format.metadata()),
    transports: [
        new winston_1.default.transports.Console({
            handleExceptions: true,
        }),
        new winston_1.default.transports.MongoDB({
            level: "error",
            db: config_1.default.mongoose.url,
            collection: "logs",
            options: { useUnifiedTopology: true },
            tryReconnect: true,
            format: winston_1.default.format.combine(mongoDBFilter()),
        }),
    ],
});
exports.default = logger;
