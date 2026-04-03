/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from "winston";
import "winston-mongodb";
import config from "./config";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      message: info.stack || info.message,
    };
  }
  return info;
});

const mongoDBFilter = winston.format((info: any) => {
  if (info?.metadata?.saveInDB) {
    return info;
  }
  return false;
});

const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",

  format: winston.format.combine(
    enumerateErrorFormat(),

    config.env === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),

    winston.format.timestamp(),

    winston.format.printf(({ level, message, timestamp, metadata }) => {
      return `${timestamp} [${level}]: ${message} ${
        metadata ? JSON.stringify(metadata) : ""
      }`;
    }),

    winston.format.metadata(),
  ),

  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),

    new winston.transports.MongoDB({
      level: "error",
      db: config.mongoose.url,
      collection: "logs",
      options: { useUnifiedTopology: true },
      tryReconnect: true,
      format: winston.format.combine(mongoDBFilter()),
    }),
  ],
});

export default logger;
