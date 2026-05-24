"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const apiError_1 = require("../../utils/apiError");
const http_status_1 = __importDefault(require("http-status"));
const roles_1 = require("../../config/roles");
class AuthValidation {
    constructor() {
        this.register = (req, res, next) => {
            const schema = joi_1.default.object().keys({
                firstName: joi_1.default.string().trim().min(2).max(50).required(),
                lastName: joi_1.default.string().trim().min(2).max(50).required(),
                emailId: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(6).required(),
                age: joi_1.default.number().min(18).max(100),
                gender: joi_1.default.string().valid("male", "female", "other"),
                photoUrl: joi_1.default.string().uri(),
                about: joi_1.default.string().max(500),
                skills: joi_1.default.array().items(joi_1.default.string()),
                role: joi_1.default.string()
                    .valid(...roles_1.Roles.roles)
                    .default("user"),
            });
            const result = schema.validate(req.body);
            if (result.error) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, result.error.message.split(`"`).join(""));
            }
            next();
        };
        this.login = (req, res, next) => {
            const schema = joi_1.default.object().keys({
                emailId: joi_1.default.string().email().required(),
                password: joi_1.default.string().required(),
            });
            const result = schema.validate(req.body);
            if (result.error) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, result.error.message.split(`"`).join(""));
            }
            next();
        };
    }
}
exports.AuthValidation = AuthValidation;
