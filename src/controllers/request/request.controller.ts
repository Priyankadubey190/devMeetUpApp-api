import { Router, Request, Response } from "express";
import { ConnectionManager } from "./request.manager";
import catchAsync from "../../utils/asyncWrapper";
import { AuthMiddleware } from "../../middlewares/auth";

export class ConnectionController {
  public router = Router();

  private _connectionManager = new ConnectionManager();
  private _auth = new AuthMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      this._auth.auth(),
      catchAsync(this.sendConnectionRequest.bind(this)),
    );
  }

  private sendConnectionRequest = async (req: Request, res: Response) => {
    const user = req.user;

    const message = await this._connectionManager.sendConnectionRequest(user!);

    res.send({
      message,
    });
  };
}
