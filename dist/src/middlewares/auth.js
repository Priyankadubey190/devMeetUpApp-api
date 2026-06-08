"use strict";
// import { Request, Response, NextFunction } from "express";
// import { User } from "../models/user.model";
// import jwt from "jsonwebtoken";
// import config from "../config/config";
// import { JwtUserPayload } from "../types/jwt";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const apiError_1 = require("../utils/apiError");
const user_model_1 = require("../models/user.model");
const roles_1 = require("../config/roles");
const logger_1 = __importDefault(require("../config/logger"));
class AuthMiddleware {
    constructor() {
        this.verifyCallback = (req, resolve, reject, requiredRights = [], options) => (token) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info("Auth middleware: token present=" +
                    Boolean(token) +
                    " path=" +
                    req.path);
            }
            catch (e) {
                // keep silent if logger fails
            }
            try {
                if (!token) {
                    return reject(new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Please authenticate"));
                }
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
                const user = yield user_model_1.User.findById(decoded._id);
                if (!user) {
                    return reject(new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "User not found"));
                }
                req.user = user;
                // ✅ Role-based access
                if (requiredRights.length) {
                    const userRights = roles_1.Roles.roleRights.get(user.role) || [];
                    const hasRequiredRights = (options === null || options === void 0 ? void 0 : options.allowSinglePermission)
                        ? requiredRights.some((r) => userRights.includes(r))
                        : requiredRights.every((r) => userRights.includes(r));
                    if (!hasRequiredRights) {
                        return reject(new apiError_1.ApiError(http_status_1.default.FORBIDDEN, "Forbidden"));
                    }
                }
                resolve();
            }
            catch (err) {
                reject(new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Please authenticate"));
            }
        });
        this.auth = (requiredRights = [], options) => (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
            return new Promise((resolve, reject) => {
                this.verifyCallback(req, resolve, reject, requiredRights, options)(token);
            })
                .then(() => next())
                .catch((err) => next(err));
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
