import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import httpStatus from "http-status";
import mongoose from "mongoose";

export class ChatValidation {
  public getChat = (req: Request, _res: Response, next: NextFunction) => {
    const { targetUserId } = req.params;

    if (
      !targetUserId ||
      typeof targetUserId !== "string" ||
      !mongoose.Types.ObjectId.isValid(targetUserId)
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid or missing Target User ID",
      );
    }

    next();
  };
}
