"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const apiError_1 = require("../../utils/apiError");
const http_status_1 = __importDefault(require("http-status"));
class RequestValidation {
    constructor() {
        this.sendRequest = (req, res, next) => {
            const schema = joi_1.default.object().keys({
                status: joi_1.default.string().valid("ignored", "interested").required(),
                toUserId: joi_1.default.string().hex().length(24).required(),
            });
            const { error } = schema.validate(req.params);
            if (error) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, error.message.replace(/"/g, ""));
            }
            next();
        };
        this.reviewRequest = (req, res, next) => {
            const schema = joi_1.default.object().keys({
                status: joi_1.default.string().valid("accepted", "rejected").required(),
                requestId: joi_1.default.string().hex().length(24).required(),
            });
            const { error } = schema.validate(req.params);
            if (error) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, error.message.replace(/"/g, ""));
            }
            next();
        };
    }
}
exports.RequestValidation = RequestValidation;
