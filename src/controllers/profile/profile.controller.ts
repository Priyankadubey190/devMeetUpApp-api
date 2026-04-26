import { Router, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncWrapper";
import { ProfileManager } from "./profile.manager";
import { AuthMiddleware } from "../../middlewares/auth";
import { ProfileValidation } from "./profile.validation";

export class ProfileController {
  public router = Router();

  private _profileManager = new ProfileManager();

  private _authMiddleware = new AuthMiddleware();
  private _validation = new ProfileValidation();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      "/view",
      this._authMiddleware.auth(),
      catchAsync(this.getProfile.bind(this)),
    );

    this.router.patch(
      "/edit",
      this._authMiddleware.auth(), // ✅ auth middleware
      catchAsync(this._validation.updateProfile),
      catchAsync(this.updateProfile.bind(this)),
    );
  }

  private getProfile = async (req: Request, res: Response) => {
    const user = await this._profileManager.getProfile(req.user);

    res.status(httpStatus.OK).send(user);
  };

  private updateProfile = async (req: Request, res: Response) => {
    const user = req.user;
    const updateData = req.body;

    const result = await this._profileManager.updateProfile(user!, updateData);

    res.status(httpStatus.OK).send({
      success: true,
      ...result,
    });
  };
}
