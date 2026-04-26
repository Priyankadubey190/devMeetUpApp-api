import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import httpStatus from "http-status";

export class RequestValidation {
  public sendRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema: ObjectSchema = Joi.object().keys({
      status: Joi.string().valid("ignored", "interested").required(),
      toUserId: Joi.string().hex().length(24).required(),
    });

    const { error } = schema.validate(req.params);
    if (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        error.message.replace(/"/g, ""),
      );
    }
    next();
  };

  public reviewRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema: ObjectSchema = Joi.object().keys({
      status: Joi.string().valid("accepted", "rejected").required(),
      requestId: Joi.string().hex().length(24).required(),
    });

    const { error } = schema.validate(req.params);
    if (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        error.message.replace(/"/g, ""),
      );
    }
    next();
  };
}
