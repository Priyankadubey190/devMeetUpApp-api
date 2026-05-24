"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.paymentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.paymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    receipt: {
        type: String,
        required: true,
    },
    notes: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        membershipType: {
            type: String,
        },
    },
}, {
    timestamps: true,
});
exports.Payment = (0, mongoose_1.model)("Payment", exports.paymentSchema);
