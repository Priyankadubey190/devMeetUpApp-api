"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidation = void 0;
const apiError_1 = require("../../utils/apiError");
const http_status_1 = __importDefault(require("http-status"));
class ProfileValidation {
    constructor() {
        this.updateProfile = (req, _res, next) => {
            const allowedEditFields = [
                "firstName",
                "lastName",
                "emailId",
                "photoUrl",
                "gender",
                "age",
                "about",
                "skills",
            ];
            const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
            if (!isEditAllowed) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid fields in update request");
            }
            next();
        };
    }
}
exports.ProfileValidation = ProfileValidation;
