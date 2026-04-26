import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import httpStatus from "http-status";

export class PaymentValidation {
  public createOrder = (req: Request, res: Response, next: NextFunction) => {
    const schema: ObjectSchema = Joi.object().keys({
      membershipType: Joi.string()
        .valid("silver", "gold", "platinum")
        .required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        error.message.replace(/"/g, ""),
      );
    }
    next();
  };
}
