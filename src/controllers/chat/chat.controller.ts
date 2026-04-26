import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncWrapper";
import { ChatManager } from "./chat.manager";
import { AuthMiddleware } from "../../middlewares/auth";
import { ChatValidation } from "./chat.validation";

export class ChatController {
  public router = Router();
  private _chatManager = new ChatManager();
  private _authMiddleware = new AuthMiddleware();
  private _validation = new ChatValidation();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/:targetUserId",
      this._authMiddleware.auth(),
      this._validation.getChat,
      catchAsync(this.getChatMessages.bind(this)),
    );
  }

  private getChatMessages = async (req: Request, res: Response) => {
    const userId = new Types.ObjectId(req.user?._id as string);

    const { targetUserId } = req.params;

    const chat = await this._chatManager.getChat(
      userId,
      targetUserId as string,
    );

    res.status(httpStatus.OK).send(chat);
  };
}
