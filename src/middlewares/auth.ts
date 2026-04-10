import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { JwtUserPayload } from "../types/jwt";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedObj = (await jwt.verify(
      token,
      config.jwt.secret,
    )) as JwtUserPayload;
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err: any) {
    res.status(400).send("ERROR" + err.message);
  }
};
