"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const apiError_1 = require("../utils/apiError");
const http_status_1 = __importDefault(require("http-status"));
const roles_1 = require("../config/roles");
class UserValidation {
    constructor() {
        this.createUser = (req, res, next) => {
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().trim().min(2).max(50).required(),
                lastName: joi_1.default.string().trim().min(2).max(50).required(),
                emailId: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(6).required(),
                age: joi_1.default.number().min(18).max(100).optional(),
                gender: joi_1.default.string().valid("male", "female", "other").optional(),
                photoUrl: joi_1.default.string().uri().optional(),
                about: joi_1.default.string().max(500).optional(),
                skills: joi_1.default.array().items(joi_1.default.string()).optional(),
                role: joi_1.default.string()
                    .valid(...roles_1.Roles.roles)
                    .default("user"),
            });
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, error.details.map((e) => e.message).join(", "));
            }
            next();
        };
        this.updateProfile = (req, res, next) => {
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().trim().min(2).max(50).optional(),
                lastName: joi_1.default.string().trim().min(2).max(50).optional(),
                emailId: joi_1.default.string().email().optional(),
                age: joi_1.default.number().min(18).max(100).optional(),
                gender: joi_1.default.string().valid("male", "female", "other").optional(),
                photoUrl: joi_1.default.string().uri().optional(),
                about: joi_1.default.string().max(500).optional(),
                skills: joi_1.default.array().items(joi_1.default.string()).optional(),
            });
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, error.details.map((e) => e.message).join(", "));
            }
            next();
        };
    }
}
exports.UserValidation = UserValidation;
