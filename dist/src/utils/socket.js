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
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const crypto_1 = __importDefault(require("crypto"));
const chat_model_1 = require("../models/chat.model");
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config/config"));
class SocketManager {
    constructor(server) {
        var _a;
        const allowedOrigins = [
            (_a = config_1.default.frontendUrl) === null || _a === void 0 ? void 0 : _a.trim(),
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ].filter(Boolean);
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: allowedOrigins,
                credentials: true,
            },
        });
        this.initializeEventListeners();
    }
    getSecretRoomId(userId, targetUserId) {
        return crypto_1.default
            .createHash("sha256")
            .update([userId, targetUserId].sort().join("$"))
            .digest("hex");
    }
    initializeEventListeners() {
        this.io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);
            socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
                const roomId = this.getSecretRoomId(userId, targetUserId);
                console.log(`${firstName} joined Room: ${roomId}`);
                socket.join(roomId);
            });
            socket.on("sendMessage", (payload) => __awaiter(this, void 0, void 0, function* () {
                const { firstName, lastName, userId, targetUserId, text } = payload;
                try {
                    const roomId = this.getSecretRoomId(userId, targetUserId);
                    console.log(`${firstName}: ${text}`);
                    let chat = yield chat_model_1.Chat.findOne({
                        participants: { $all: [userId, targetUserId] },
                    });
                    if (!chat) {
                        chat = new chat_model_1.Chat({
                            participants: [userId, targetUserId],
                            messages: [],
                        });
                    }
                    chat.messages.push({
                        senderId: new mongoose_1.Types.ObjectId(userId),
                        text,
                        createdAt: new Date(), // Good practice to include timestamps
                    });
                    yield chat.save();
                    this.io.to(roomId).emit("messageReceived", {
                        firstName,
                        lastName,
                        text,
                        senderId: userId,
                    });
                }
                catch (err) {
                    console.error("Socket Message Error:", err);
                }
            }));
            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });
    }
}
const initializeSocket = (server) => {
    return new SocketManager(server);
};
exports.initializeSocket = initializeSocket;
