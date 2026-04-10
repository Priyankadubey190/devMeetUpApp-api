import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import httpStatus from "http-status";
import { Roles } from "../../config/roles";

export class AuthValidation {
  public register = (req: Request, res: Response, next: NextFunction) => {
    const schema: ObjectSchema = Joi.object().keys({
      firstName: Joi.string().trim().min(2).max(50).required(),

      lastName: Joi.string().trim().min(2).max(50).required(),

      emailId: Joi.string().email().required(),

      password: Joi.string().min(6).required(),

      age: Joi.number().min(18).max(100),

      gender: Joi.string().valid("male", "female", "other"),

      photoUrl: Joi.string().uri(),

      about: Joi.string().max(500),

      skills: Joi.array().items(Joi.string()),

      role: Joi.string()
        .valid(...Roles.roles)
        .default("user"),
    });

    const result = schema.validate(req.body);

    if (result.error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        result.error.message.split(`"`).join(""),
      );
    }

    next();
  };

  public login = (req: Request, res: Response, next: NextFunction) => {
    const schema: ObjectSchema = Joi.object().keys({
      emailId: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const result = schema.validate(req.body);

    if (result.error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        result.error.message.split(`"`).join(""),
      );
    }

    next();
  };

  public logout = (req: Request, res: Response, next: NextFunction) => {
    const schema: ObjectSchema = Joi.object().keys({
      refreshToken: Joi.string().required(),
    });

    const result = schema.validate(req.body);

    if (result.error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        result.error.message.split(`"`).join(""),
      );
    }

    next();
  };
}
