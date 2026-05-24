"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./src/config/config"));
const logger_1 = __importDefault(require("./src/config/logger"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./src/utils/socket");
let server = http_1.default.createServer(app_1.default);
(0, socket_1.initializeSocket)(server);
mongoose_1.default
    .connect(config_1.default.mongoose.url)
    .then(() => {
    logger_1.default.info("MongoDB connected");
    server = server.listen(config_1.default.port, () => {
        logger_1.default.info(`Server running on port ${config_1.default.port}`);
    });
})
    .catch((err) => {
    logger_1.default.error("MongoDB connection failed", {
        error: err,
        saveInDB: true,
    });
});
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger_1.default.info("Server closed");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    logger_1.default.error("Unexpected Error", {
        error,
        saveInDB: true,
    });
    exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
    logger_1.default.info("SIGTERM received");
    if (server) {
        server.close();
    }
});
mongoose_1.default.connection.on("disconnected", () => {
    logger_1.default.warn("MongoDB disconnected");
});
mongoose_1.default.connection.on("connected", () => {
    logger_1.default.info("MongoDB reconnected");
});
