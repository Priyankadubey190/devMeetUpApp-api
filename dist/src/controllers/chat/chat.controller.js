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
exports.ChatController = void 0;
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const http_status_1 = __importDefault(require("http-status"));
const asyncWrapper_1 = __importDefault(require("../../utils/asyncWrapper"));
const chat_manager_1 = require("./chat.manager");
const auth_1 = require("../../middlewares/auth");
const chat_validation_1 = require("./chat.validation");
class ChatController {
    constructor() {
        this.router = (0, express_1.Router)();
        this._chatManager = new chat_manager_1.ChatManager();
        this._authMiddleware = new auth_1.AuthMiddleware();
        this._validation = new chat_validation_1.ChatValidation();
        this.getChatMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            const { targetUserId } = req.params;
            const chat = yield this._chatManager.getChat(userId, targetUserId);
            res.status(http_status_1.default.OK).send(chat);
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/:targetUserId", this._authMiddleware.auth(), this._validation.getChat, (0, asyncWrapper_1.default)(this.getChatMessages.bind(this)));
    }
}
exports.ChatController = ChatController;
