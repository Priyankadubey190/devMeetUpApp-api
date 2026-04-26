import mongoose from "mongoose";
import app from "./app";
import config from "./src/config/config";
import logger from "./src/config/logger";
import http from "http";
import { initializeSocket } from "./src/utils/socket";

let server = http.createServer(app);
initializeSocket(server);

mongoose
  .connect(config.mongoose.url)
  .then(() => {
    logger.info("MongoDB connected");

    server = server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed", {
      error: err,
      saveInDB: true,
    });
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error("Unexpected Error", {
    error,
    saveInDB: true,
  });
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("connected", () => {
  logger.info("MongoDB reconnected");
});
