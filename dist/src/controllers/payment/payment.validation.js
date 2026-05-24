"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const apiError_1 = require("../../utils/apiError");
const http_status_1 = __importDefault(require("http-status"));
class PaymentValidation {
    constructor() {
        this.createOrder = (req, res, next) => {
            const schema = joi_1.default.object().keys({
                membershipType: joi_1.default.string()
                    .valid("silver", "gold", "platinum")
                    .required(),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, error.message.replace(/"/g, ""));
            }
            next();
        };
    }
}
exports.PaymentValidation = PaymentValidation;
