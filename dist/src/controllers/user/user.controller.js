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
exports.UserController = void 0;
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const asyncWrapper_1 = __importDefault(require("../../utils/asyncWrapper"));
const auth_1 = require("../../middlewares/auth");
const user_manager_1 = require("./user.manager");
class UserController {
    constructor() {
        this.router = (0, express_1.Router)();
        this._userManager = new user_manager_1.UserManager();
        this._auth = new auth_1.AuthMiddleware();
        this.getReceivedRequests = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = req.user;
            const data = yield this._userManager.getReceivedRequests(loggedInUser._id.toString());
            res.status(http_status_1.default.OK).json({
                message: "Data fetched successfully",
                data,
            });
        });
        this.getConnections = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = req.user;
            const data = yield this._userManager.getConnections(loggedInUser._id.toString());
            res.status(http_status_1.default.OK).json({ data });
        });
        this.getFeed = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = req.user;
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            limit = limit > 50 ? 50 : limit;
            const skip = (page - 1) * limit;
            const data = yield this._userManager.getFeed(loggedInUser._id.toString(), skip, limit);
            res.status(http_status_1.default.OK).json({ data });
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/user/requests/received", this._auth.auth(), (0, asyncWrapper_1.default)(this.getReceivedRequests));
        this.router.get("/user/connections", this._auth.auth(), (0, asyncWrapper_1.default)(this.getConnections));
        this.router.get("/feed", this._auth.auth(), (0, asyncWrapper_1.default)(this.getFeed));
    }
}
exports.UserController = UserController;
