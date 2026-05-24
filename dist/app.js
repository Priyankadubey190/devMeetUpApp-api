"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_status_1 = __importDefault(require("http-status"));
const routes_1 = __importDefault(require("./routes"));
const apiError_1 = require("./src/utils/apiError");
const error_1 = require("./src/middlewares/error");
const logger_1 = __importDefault(require("./src/config/logger"));
// import { userAuth } from "./src/middlewares/auth";
const config_1 = __importDefault(require("./src/config/config"));
const cookieParser = require("cookie-parser");
const app = (0, express_1.default)();
const _errorHandler = new error_1.ErrorHandler();
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(cookieParser());
app.use(express_1.default.urlencoded({ extended: true }));
const allowedOrigins = [
    (_a = config_1.default.frontendUrl) === null || _a === void 0 ? void 0 : _a.trim(),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new apiError_1.ApiError(http_status_1.default.FORBIDDEN, "CORS origin denied"));
        }
    },
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
});
app.use(limiter);
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.originalUrl}`);
    next();
});
app.use("/", routes_1.default);
////////////
// app.get("/profile", async (req: Request, res: Response) => {
//   try {
//     const user = req.user;
//     res.send(user);
//   } catch (err: any) {
//     res.status(400).send("ERROR " + err.message);
//   }
// });
// app.get("/user", async (req: Request, res: Response) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.find({ emailId: userEmail });
//     if (user.length === 0) {
//       res.status(404).send("user not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });
// app.get("/feed", async (req: Request, res: Response) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong ");
//   }
// });
// app.delete("/user", async (req: Request, res: Response) => {
//   const userId = req.body.userId;
//   try {
//     const user = await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });
// app.patch("/user/:userId", async (req: Request, res: Response) => {
//   const userId = req.params.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATE = [
//       "userId",
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//     ];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATE.includes(k),
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     const user = await User.findByIdAndUpdate({ _id: userId }, data);
//     res.send("User updated successfully");
//   } catch (err: any) {
//     res.status(400).send(err.message);
//   }
// });
/////////////
app.use((req, res, next) => {
    next(new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Route not found"));
});
app.use(_errorHandler.errorHandler);
exports.default = app;
