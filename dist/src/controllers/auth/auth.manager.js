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
exports.AuthManager = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../../models/user.model");
const apiError_1 = require("../../utils/apiError");
const http_status_1 = __importDefault(require("http-status"));
class AuthManager {
    constructor() {
        this.registerUser = (body) => __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, age, gender, about, photoUrl, skills, role, emailId, password, } = body;
            const existingUser = yield user_model_1.User.findOne({ emailId });
            if (existingUser) {
                throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Email already exists");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield user_model_1.User.create({
                firstName,
                lastName,
                emailId,
                password: hashedPassword,
                age,
                gender,
                about,
                photoUrl,
                skills,
                role,
            });
            return user;
        });
        this.loginWithEmailAndPassword = (emailId, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({ emailId });
            if (!user) {
                throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Incorrect email or password");
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Incorrect email or password");
            }
            return user;
        });
    }
}
exports.AuthManager = AuthManager;
