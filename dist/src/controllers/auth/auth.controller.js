"use strict";
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
exports.AuthController = void 0;
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const asyncWrapper_1 = __importDefault(require("../../utils/asyncWrapper"));
const auth_manager_1 = require("./auth.manager");
const auth_validation_1 = require("./auth.validation");
const token_manager_1 = require("../token/token.manager");
const logger_1 = __importDefault(require("../../config/logger"));
class AuthController {
    constructor() {
        this.router = (0, express_1.Router)();
        this._authManager = new auth_manager_1.AuthManager();
        this._tokenManager = new token_manager_1.TokenManager();
        this._authValidation = new auth_validation_1.AuthValidation();
        this.signUp = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this._authManager.registerUser(req.body);
            const tokens = this._tokenManager.generateAuthToken(user);
            res.cookie("token", tokens.access.token, this.cookieOptions);
            try {
                logger_1.default.info(`Auth controller (signup): Set-Cookie header present=${Boolean((_a = res.getHeader) === null || _a === void 0 ? void 0 : _a.call(res, "Set-Cookie"))}`);
            }
            catch (e) {
                // ignore logging errors
            }
            res.status(http_status_1.default.CREATED).send({
                message: "User registered successfully",
                user,
            });
        }));
        this.login = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { emailId, password } = req.body;
            const user = yield this._authManager.loginWithEmailAndPassword(emailId, password);
            const tokens = this._tokenManager.generateAuthToken(user);
            res.cookie("token", tokens.access.token, this.cookieOptions);
            try {
                logger_1.default.info(`Auth controller (login): Set-Cookie header present=${Boolean((_a = res.getHeader) === null || _a === void 0 ? void 0 : _a.call(res, "Set-Cookie"))}`);
            }
            catch (e) {
                // ignore logging errors
            }
            res.status(http_status_1.default.OK).send({
                message: "Login successful",
                user,
            });
        }));
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("token", this.cookieOptions);
            res.status(http_status_1.default.OK).send({
                message: "Logout successful",
            });
        });
        this.initializeRoutes();
    }
    /** Shared cookie options — must be identical for set and clear */
    get cookieOptions() {
        const isProd = process.env.NODE_ENV === "production";
        return {
            httpOnly: true,
            secure: isProd,
            sameSite: (isProd ? "none" : "lax"),
            path: "/",
        };
    }
    initializeRoutes() {
        this.router.post("/signup", (0, asyncWrapper_1.default)(this._authValidation.register), this.signUp);
        this.router.post("/login", (0, asyncWrapper_1.default)(this._authValidation.login), this.login);
        this.router.post("/logout", this.logout);
    }
}
exports.AuthController = AuthController;
