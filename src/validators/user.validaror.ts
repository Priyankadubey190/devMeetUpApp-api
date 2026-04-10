import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import httpStatus from "http-status";
import { Roles } from "../config/roles";

export class UserValidation {
  public createUser = (req: Request, res: Response, next: NextFunction) => {
    const schema: ObjectSchema = Joi.object({
      firstName: Joi.string().trim().min(2).max(50).required(),

      lastName: Joi.string().trim().min(2).max(50).required(),

      emailId: Joi.string().email().required(),

      password: Joi.string().min(6).required(),

      age: Joi.number().min(18).max(100).optional(),

      gender: Joi.string().valid("male", "female", "other").optional(),

      photoUrl: Joi.string().uri().optional(),

      about: Joi.string().max(500).optional(),

      skills: Joi.array().items(Joi.string()).optional(),

      role: Joi.string()
        .valid(...Roles.roles)
        .default("user"),
    });

    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        error.details.map((e) => e.message).join(", "),
      );
    }

    next();
  };

  public updateProfile = (req: Request, res: Response, next: NextFunction) => {
    const schema: ObjectSchema = Joi.object({
      firstName: Joi.string().trim().min(2).max(50).optional(),

      lastName: Joi.string().trim().min(2).max(50).optional(),

      emailId: Joi.string().email().optional(),

      age: Joi.number().min(18).max(100).optional(),

      gender: Joi.string().valid("male", "female", "other").optional(),

      photoUrl: Joi.string().uri().optional(),

      about: Joi.string().max(500).optional(),

      skills: Joi.array().items(Joi.string()).optional(),
    });

    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        error.details.map((e) => e.message).join(", "),
      );
    }

    next();
  };
}
