"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionRequest = void 0;
const mongoose_1 = require("mongoose");
const connectionRequestSchema = new mongoose_1.Schema({
    fromUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["ignored", "interested", "accepted", "rejected"],
    },
}, { timestamps: true });
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
exports.ConnectionRequest = (0, mongoose_1.model)("ConnectionRequest", connectionRequestSchema);
