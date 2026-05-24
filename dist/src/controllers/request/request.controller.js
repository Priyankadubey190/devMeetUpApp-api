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
exports.ConnectionController = void 0;
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const asyncWrapper_1 = __importDefault(require("../../utils/asyncWrapper"));
const auth_1 = require("../../middlewares/auth");
const request_manager_1 = require("./request.manager");
const request_validation_1 = require("./request.validation");
class ConnectionController {
    constructor() {
        this.router = (0, express_1.Router)();
        this._requestManager = new request_manager_1.RequestManager();
        this._requestValidation = new request_validation_1.RequestValidation();
        this._auth = new auth_1.AuthMiddleware();
        this.sendRequest = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const fromUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
            const status = req.params.status;
            const toUserId = req.params.toUserId;
            const { connectionRequest, toUserName } = yield this._requestManager.sendConnectionRequest(fromUserId, toUserId, status);
            const message = status === "ignored"
                ? `${(_b = req.user) === null || _b === void 0 ? void 0 : _b.firstName} ignored ${toUserName}`
                : `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.firstName} is interested in ${toUserName}`;
            res.status(http_status_1.default.OK).json({
                message,
                data: connectionRequest,
            });
        }));
        this.reviewRequest = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
            const requestId = req.params.requestId;
            const status = req.params.status;
            const data = yield this._requestManager.reviewConnectionRequest(loggedInUserId, requestId, status);
            res.status(http_status_1.default.OK).json({
                message: `Connection request ${status}`,
                data,
            });
        }));
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/request/send/:status/:toUserId", this._auth.auth(), this._requestValidation.sendRequest, this.sendRequest);
        this.router.post("/request/review/:status/:requestId", this._auth.auth(), this._requestValidation.reviewRequest, this.reviewRequest);
    }
}
exports.ConnectionController = ConnectionController;
