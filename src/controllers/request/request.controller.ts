import { Router, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncWrapper";
import { AuthMiddleware } from "../../middlewares/auth";
import { ConnectionStatus } from "../../models/connectionRequest.model";
import { RequestManager } from "./request.manager";
import { RequestValidation } from "./request.validation";

export class ConnectionController {
  public router = Router();
  private _requestManager = new RequestManager();
  private _requestValidation = new RequestValidation();
  private _auth = new AuthMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/request/send/:status/:toUserId",
      this._auth.auth(),
      this._requestValidation.sendRequest,
      this.sendRequest,
    );

    this.router.post(
      "/request/review/:status/:requestId",
      this._auth.auth(),
      this._requestValidation.reviewRequest,
      this.reviewRequest,
    );
  }

  private sendRequest = catchAsync(async (req: Request, res: Response) => {
    const fromUserId = req.user?._id.toString()!;
    const status = req.params.status as ConnectionStatus;
    const toUserId = req.params.toUserId as string;

    const { connectionRequest, toUserName } =
      await this._requestManager.sendConnectionRequest(
        fromUserId,
        toUserId,
        status,
      );

    const message =
      status === "ignored"
        ? `${req.user?.firstName} ignored ${toUserName}`
        : `${req.user?.firstName} is interested in ${toUserName}`;

    res.status(httpStatus.OK).json({
      message,
      data: connectionRequest,
    });
  });

  private reviewRequest = catchAsync(async (req: Request, res: Response) => {
    const loggedInUserId = req.user?._id.toString()!;

    const requestId = req.params.requestId as string;
    const status = req.params.status as string;

    const data = await this._requestManager.reviewConnectionRequest(
      loggedInUserId,
      requestId,
      status,
    );

    res.status(httpStatus.OK).json({
      message: `Connection request ${status}`,
      data,
    });
  });
}
