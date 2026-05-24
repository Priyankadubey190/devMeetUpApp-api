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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = exports.USER_SAFE_DATA = void 0;
const connectionRequest_model_1 = require("../../models/connectionRequest.model");
const user_model_1 = require("../../models/user.model");
exports.USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
class UserManager {
    constructor() {
        this.getReceivedRequests = (loggedInUserId) => __awaiter(this, void 0, void 0, function* () {
            const connectionRequests = yield connectionRequest_model_1.ConnectionRequest.find({
                toUserId: loggedInUserId,
                status: "interested",
            }).populate("fromUserId", exports.USER_SAFE_DATA);
            return connectionRequests;
        });
        this.getConnections = (loggedInUserId) => __awaiter(this, void 0, void 0, function* () {
            const connectionRequests = yield connectionRequest_model_1.ConnectionRequest.find({
                $or: [
                    { toUserId: loggedInUserId, status: "accepted" },
                    { fromUserId: loggedInUserId, status: "accepted" },
                ],
            })
                .populate("fromUserId", exports.USER_SAFE_DATA)
                .populate("toUserId", exports.USER_SAFE_DATA);
            const data = connectionRequests.map((row) => {
                if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
                    return row.toUserId;
                }
                return row.fromUserId;
            });
            return data;
        });
        this.getFeed = (loggedInUserId, skip, limit) => __awaiter(this, void 0, void 0, function* () {
            const connectionRequests = yield connectionRequest_model_1.ConnectionRequest.find({
                $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
            }).select("fromUserId toUserId");
            const hideUsersFromFeed = new Set();
            connectionRequests.forEach((req) => {
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());
            });
            hideUsersFromFeed.add(loggedInUserId.toString());
            const users = yield user_model_1.User.find({
                _id: { $nin: Array.from(hideUsersFromFeed) },
            })
                .select(exports.USER_SAFE_DATA)
                .skip(skip)
                .limit(limit);
            return users;
        });
    }
}
exports.UserManager = UserManager;
