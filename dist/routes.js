"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./src/controllers/auth/auth.controller");
const profile_controller_1 = require("./src/controllers/profile/profile.controller");
const request_controller_1 = require("./src/controllers/request/request.controller");
const user_controller_1 = require("./src/controllers/user/user.controller");
const chat_controller_1 = require("./src/controllers/chat/chat.controller");
const router = (0, express_1.Router)();
const routes = [
    {
        path: "/auth",
        route: new auth_controller_1.AuthController().router,
    },
    {
        path: "/profile",
        route: new profile_controller_1.ProfileController().router,
    },
    {
        path: "/",
        route: new request_controller_1.ConnectionController().router,
    },
    {
        path: "/",
        route: new user_controller_1.UserController().router,
    },
    {
        path: "/chat",
        route: new chat_controller_1.ChatController().router,
    },
];
routes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
