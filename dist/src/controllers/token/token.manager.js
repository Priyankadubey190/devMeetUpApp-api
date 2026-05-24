"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../../config/config"));
class TokenManager {
    constructor() {
        this.generateToken = (userId, expires) => {
            const payload = {
                _id: userId,
                iat: (0, moment_1.default)().unix(),
                exp: expires.unix(),
            };
            return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret);
        };
        this.generateAuthToken = (user) => {
            const accessTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, "minutes");
            const accessToken = this.generateToken(String(user._id), accessTokenExpires);
            return {
                access: {
                    token: accessToken,
                    expires: accessTokenExpires.toDate(),
                },
            };
        };
        this.verifyToken = (token) => {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
                return decoded;
            }
            catch (error) {
                throw new Error("Invalid token");
            }
        };
    }
}
exports.TokenManager = TokenManager;
