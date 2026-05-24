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
exports.ProfileController = void 0;
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const asyncWrapper_1 = __importDefault(require("../../utils/asyncWrapper"));
const profile_manager_1 = require("./profile.manager");
const auth_1 = require("../../middlewares/auth");
const profile_validation_1 = require("./profile.validation");
class ProfileController {
    constructor() {
        this.router = (0, express_1.Router)();
        this._profileManager = new profile_manager_1.ProfileManager();
        this._authMiddleware = new auth_1.AuthMiddleware();
        this._validation = new profile_validation_1.ProfileValidation();
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._profileManager.getProfile(req.user);
            res.status(http_status_1.default.OK).send(user);
        });
        this.updateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const updateData = req.body;
            const result = yield this._profileManager.updateProfile(user, updateData);
            res.status(http_status_1.default.OK).send(Object.assign({ success: true }, result));
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/view", this._authMiddleware.auth(), (0, asyncWrapper_1.default)(this.getProfile.bind(this)));
        this.router.patch("/edit", this._authMiddleware.auth(), // ✅ auth middleware
        (0, asyncWrapper_1.default)(this._validation.updateProfile), (0, asyncWrapper_1.default)(this.updateProfile.bind(this)));
    }
}
exports.ProfileController = ProfileController;
