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
exports.User = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const roles_1 = require("../config/roles");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config/config"));
exports.userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, minLength: 3, maxLength: 50 },
    lastName: { type: String },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
    age: { type: Number, min: 18, max: 50 },
    gender: { type: String },
    isPremium: {
        type: Boolean,
        default: false,
    },
    membershipType: {
        type: String,
    },
    photoUrl: {
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    about: { type: String, default: "This is default about for user" },
    skills: { type: [String] },
    role: {
        type: String,
        enum: roles_1.Roles.roles,
        default: "user",
    },
}, {
    timestamps: true,
});
exports.userSchema.methods.getJWT = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = yield jsonwebtoken_1.default.sign({ _id: user._id }, config_1.default.jwt.secret, {
            expiresIn: "7d",
        });
        return token;
    });
};
exports.userSchema.methods.validatePassword = function (passwordInputByUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const passwordHash = user.password;
        const isPasswordValid = yield bcrypt_1.default.compare(passwordInputByUser, passwordHash);
        return isPasswordValid;
    });
};
exports.User = (0, mongoose_1.model)("User", exports.userSchema);
