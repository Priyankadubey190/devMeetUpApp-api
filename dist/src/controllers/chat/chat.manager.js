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
exports.ChatManager = void 0;
const http_status_1 = __importDefault(require("http-status"));
const chat_model_1 = require("../../models/chat.model");
const apiError_1 = require("../../utils/apiError");
const mongoose_1 = require("mongoose");
class ChatManager {
    constructor() {
        this.getChat = (userId, targetUserId) => __awaiter(this, void 0, void 0, function* () {
            if (!targetUserId) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Target User ID is required");
            }
            try {
                const targetId = new mongoose_1.Types.ObjectId(targetUserId);
                let chat = yield chat_model_1.Chat.findOne({
                    participants: { $all: [userId, targetId] },
                }).populate({
                    path: "messages.senderId",
                    select: "firstName lastName photoUrl",
                });
                if (!chat) {
                    chat = new chat_model_1.Chat({
                        participants: [userId, targetId],
                        messages: [],
                    });
                    yield chat.save();
                }
                return chat;
            }
            catch (error) {
                if (error.name === "BSONError" || error.name === "CastError") {
                    throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid User ID format");
                }
                throw error;
            }
        });
    }
}
exports.ChatManager = ChatManager;
