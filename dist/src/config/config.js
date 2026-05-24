"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), ".env"),
});
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid("development", "production", "test")
        .default("development"),
    PORT: joi_1.default.number().default(5000),
    MONGODB_URL: joi_1.default.string().required(),
    JWT_SECRET: joi_1.default.string().required(),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.number().default(30),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number().default(30),
    FRONTEND_URL: joi_1.default.string().required(),
    SOCKET_PORT: joi_1.default.number().default(5001),
    CLOUDINARY_CLOUD_NAME: joi_1.default.string().optional(),
    CLOUDINARY_API_KEY: joi_1.default.string().optional(),
    CLOUDINARY_API_SECRET: joi_1.default.string().optional(),
}).unknown();
const { value: envVars, error } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config error: ${error.message}`);
}
const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    frontendUrl: envVars.FRONTEND_URL,
    mongoose: {
        url: envVars.MONGODB_URL,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    socket: {
        port: envVars.SOCKET_PORT,
    },
    // cloudinary: {
    //   cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    //   apiKey: envVars.CLOUDINARY_API_KEY,
    //   apiSecret: envVars.CLOUDINARY_API_SECRET,
    // },
};
exports.default = config;
