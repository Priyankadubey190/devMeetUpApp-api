import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import httpStatus from "http-status";

export class ProfileValidation {
  public updateProfile = (req: Request, _res: Response, next: NextFunction) => {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "gender",
      "age",
      "about",
      "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field),
    );

    if (!isEditAllowed) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid fields in update request",
      );
    }

    next();
  };
}
