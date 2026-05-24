"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatValidation = void 0;
const apiError_1 = require("../../utils/apiError");
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
class ChatValidation {
    constructor() {
        this.getChat = (req, _res, next) => {
            const { targetUserId } = req.params;
            if (!targetUserId ||
                typeof targetUserId !== "string" ||
                !mongoose_1.default.Types.ObjectId.isValid(targetUserId)) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid or missing Target User ID");
            }
            next();
        };
    }
}
exports.ChatValidation = ChatValidation;
