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
exports.RequestManager = void 0;
const connectionRequest_model_1 = require("../../models/connectionRequest.model");
const user_model_1 = require("../../models/user.model");
const apiError_1 = require("../../utils/apiError");
const http_status_1 = __importDefault(require("http-status"));
class RequestManager {
    constructor() {
        this.sendConnectionRequest = (fromUserId, toUserId, status) => __awaiter(this, void 0, void 0, function* () {
            if (fromUserId === toUserId) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "You cannot send a request to yourself");
            }
            const toUser = yield user_model_1.User.findById(toUserId);
            if (!toUser) {
                throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User not found");
            }
            const existingRequest = yield connectionRequest_model_1.ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });
            if (existingRequest) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Connection request already exists");
            }
            const connectionRequest = yield connectionRequest_model_1.ConnectionRequest.create({
                fromUserId,
                toUserId,
                status,
            });
            return { connectionRequest, toUserName: toUser.firstName };
        });
        this.reviewConnectionRequest = (loggedInUserId, requestId, status) => __awaiter(this, void 0, void 0, function* () {
            const connectionRequest = yield connectionRequest_model_1.ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUserId,
                status: "interested",
            });
            if (!connectionRequest) {
                throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Connection request not found");
            }
            connectionRequest.status = status;
            const data = yield connectionRequest.save();
            return data;
        });
    }
}
exports.RequestManager = RequestManager;
