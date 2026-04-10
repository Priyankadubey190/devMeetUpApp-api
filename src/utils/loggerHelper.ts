/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from "../config/logger";

interface MetaData {
  logId: string;
  kind: string;
  data?: any;
  requestData?: any;
  requestMethod?: string;
  responseData?: any;
  error?: Error;
  saveInDB?: boolean; // 🔥 important for MongoDB logging
}

const processError = (
  metaData: MetaData,
  error?: unknown,
): [Error | undefined, MetaData] => {
  if (error instanceof Error) {
    if ((error as any).isAxiosError) {
      metaData.requestData = (error as any).config?.data;
      metaData.requestMethod = (error as any).config?.method;
      metaData.responseData = (error as any).response?.data;
    }

    const newError = new Error(error.message);
    newError.stack = error.stack;

    metaData.error = newError;

    return [newError, metaData];
  }

  return [undefined, metaData];
};

class LoggerHelper {
  static logError(
    logId: string,
    error?: unknown,
    data?: any,
    kind = "custom",
    saveInDB = true,
  ): void {
    if (!logId) return;

    const metaData: MetaData = {
      logId,
      kind,
      saveInDB,
      ...(data && Object.keys(data).length > 0 && { data }),
    };

    try {
      const [logError, logMetadata] = processError(metaData, error);

      const message = logError ? logError.message : `Error occurred in ${kind}`;

      logger.error(message, logMetadata);
    } catch (err) {
      logger.error("LoggerHelper failed", {
        ...metaData,
        error,
        err,
        saveInDB: true,
      });
    }
  }

  static logInfo(message: string, data?: any): void {
    logger.info(message, {
      ...(data && { data }),
    });
  }

  static logWarn(message: string, data?: any): void {
    logger.warn(message, {
      ...(data && { data }),
    });
  }
}

export default LoggerHelper;
