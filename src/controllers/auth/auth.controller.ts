import { Router, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncWrapper";
import { AuthManager } from "./auth.manager";
import { AuthValidation } from "./auth.validation";
import { TokenManager } from "../token/token.manager";
import logger from "../../config/logger";

export class AuthController {
  public router = Router();

  private _authManager = new AuthManager();
  private _tokenManager = new TokenManager();
  private _authValidation = new AuthValidation();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/signup",
      catchAsync(this._authValidation.register),
      this.signUp,
    );
    this.router.post(
      "/login",
      catchAsync(this._authValidation.login),
      this.login,
    );
    this.router.post("/logout", this.logout);
  }

  private signUp = catchAsync(async (req: Request, res: Response) => {
    const user = await this._authManager.registerUser(req.body);

    const tokens = this._tokenManager.generateAuthToken(user);

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    } as const;

    res.cookie("token", tokens.access.token, cookieOptions);
    try {
      const hasSetCookie = Boolean(
        res.getHeader && res.getHeader("Set-Cookie"),
      );
      logger.info(
        `Auth controller (signup): Set-Cookie header present=${hasSetCookie}`,
      );
    } catch (e) {
      // ignore logging errors
    }

    res.status(httpStatus.CREATED).send({
      message: "User registered successfully",
      user,
    });
  });

  private login = catchAsync(async (req: Request, res: Response) => {
    const { emailId, password } = req.body;

    const user = await this._authManager.loginWithEmailAndPassword(
      emailId,
      password,
    );

    const tokens = this._tokenManager.generateAuthToken(user);

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    } as const;

    res.cookie("token", tokens.access.token, cookieOptions);
    try {
      const hasSetCookie = Boolean(
        res.getHeader && res.getHeader("Set-Cookie"),
      );
      logger.info(
        `Auth controller (login): Set-Cookie header present=${hasSetCookie}`,
      );
    } catch (e) {
      // ignore logging errors
    }

    res.status(httpStatus.OK).send({
      message: "Login successful",
      user,
    });
  });

  private logout = async (req: Request, res: Response) => {
    res.clearCookie("token", { path: "/" });

    res.status(httpStatus.OK).send({
      message: "Logout successful",
    });
  };
}
