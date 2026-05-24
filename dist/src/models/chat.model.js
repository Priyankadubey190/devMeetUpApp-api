"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.chatSchema = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.chatSchema = new mongoose_1.Schema({
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    messages: [messageSchema],
}, {
    timestamps: true,
});
exports.Chat = (0, mongoose_1.model)("Chat", exports.chatSchema);
