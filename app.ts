import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import httpStatus from "http-status";
import types from "./src/types/express";
import routes from "./routes";
import { ApiError } from "./src/utils/apiError";
import { ErrorHandler } from "./src/middlewares/error";
import logger from "./src/config/logger";
import { User } from "./src/models/user.model";
import { userAuth } from "./src/middlewares/auth";

import config from "./src/config/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const cookieParser = require("cookie-parser");

const app = express();
const _errorHandler = new ErrorHandler();

app.use(helmet());

app.use(compression());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});
app.use("/api/v1", routes);

////////////

app.get("/profile", userAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err: any) {
    res.status(400).send("ERROR " + err.message);
  }
});

app.post(
  "/sendConnectionRequest",
  userAuth,
  async (req: Request, res: Response) => {
    const user = req.user;
    console.log("Sending a connection request");
    res.send(user?.firstName + " send the connection request");
  },
);

app.get("/user", async (req: Request, res: Response) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

app.delete("/user", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATE = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User updated successfully");
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

/////////////

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route not found"));
});

app.use(_errorHandler.errorHandler);

export default app;
