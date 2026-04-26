import { Router, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncWrapper";
import { AuthMiddleware } from "../../middlewares/auth";
import { UserManager } from "./user.manager";

export class UserController {
  public router = Router();
  private _userManager = new UserManager();
  private _auth = new AuthMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/user/requests/received",
      this._auth.auth(),
      catchAsync(this.getReceivedRequests),
    );

    this.router.get(
      "/user/connections",
      this._auth.auth(),
      catchAsync(this.getConnections),
    );

    this.router.get("/feed", this._auth.auth(), catchAsync(this.getFeed));
  }

  private getReceivedRequests = async (req: Request, res: Response) => {
    const loggedInUser = req.user!;
    const data = await this._userManager.getReceivedRequests(
      loggedInUser._id.toString(),
    );

    res.status(httpStatus.OK).json({
      message: "Data fetched successfully",
      data,
    });
  };

  private getConnections = async (req: Request, res: Response) => {
    const loggedInUser = req.user!;
    const data = await this._userManager.getConnections(
      loggedInUser._id.toString(),
    );

    res.status(httpStatus.OK).json({ data });
  };

  private getFeed = async (req: Request, res: Response) => {
    const loggedInUser = req.user!;

    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const data = await this._userManager.getFeed(
      loggedInUser._id.toString(),
      skip,
      limit,
    );

    res.status(httpStatus.OK).json({ data });
  };
}
