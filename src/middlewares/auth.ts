// import { Request, Response, NextFunction } from "express";
// import { User } from "../models/user.model";
// import jwt from "jsonwebtoken";
// import config from "../config/config";
// import { JwtUserPayload } from "../types/jwt";

// export const userAuth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       throw new Error("Token is not valid");
//     }
//     const decodedObj = (await jwt.verify(
//       token,
//       config.jwt.secret,
//     )) as JwtUserPayload;
//     const { _id } = decodedObj;
//     const user = await User.findById(_id);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     req.user = user;
//     next();
//   } catch (err: any) {
//     res.status(400).send("ERROR" + err.message);
//   }
// };

import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { ApiError } from "../utils/apiError";
import { User } from "../models/user.model";
import { Roles } from "../config/roles";
import { IUserDocument } from "../models/user.model";
import { JwtUserPayload } from "../types/jwt";

// ✅ Extend Request
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export class AuthMiddleware {
  private verifyCallback =
    (
      req: Request,
      resolve: any,
      reject: (arg: any) => void,
      requiredRights: string[] = [],
      options?: { allowSinglePermission?: boolean },
    ) =>
    async (token: string | undefined) => {
      try {
        if (!token) {
          return reject(
            new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"),
          );
        }

        const decoded = jwt.verify(token, config.jwt.secret) as JwtUserPayload;

        const user = await User.findById(decoded._id);

        if (!user) {
          return reject(
            new ApiError(httpStatus.UNAUTHORIZED, "User not found"),
          );
        }

        req.user = user;

        // ✅ Role-based access
        if (requiredRights.length) {
          const userRights = Roles.roleRights.get(user.role) || [];

          const hasRequiredRights = options?.allowSinglePermission
            ? requiredRights.some((r) => userRights.includes(r))
            : requiredRights.every((r) => userRights.includes(r));

          if (!hasRequiredRights) {
            return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
          }
        }

        resolve();
      } catch (err) {
        reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
      }
    };

  public auth =
    (
      requiredRights: string[] = [],
      options?: { allowSinglePermission?: boolean },
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies?.token;

      return new Promise((resolve, reject) => {
        this.verifyCallback(
          req,
          resolve,
          reject,
          requiredRights,
          options,
        )(token);
      })
        .then(() => next())
        .catch((err) => next(err));
    };
}
