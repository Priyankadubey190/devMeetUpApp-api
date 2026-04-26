import { Router } from "express";
import { AuthController } from "./src/controllers/auth/auth.controller";
import { ProfileController } from "./src/controllers/profile/profile.controller";
import { ConnectionController } from "./src/controllers/request/request.controller";
import { UserController } from "./src/controllers/user/user.controller";
import { ChatController } from "./src/controllers/chat/chat.controller";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: new AuthController().router,
  },
  {
    path: "/profile",
    route: new ProfileController().router,
  },
  {
    path: "/",
    route: new ConnectionController().router,
  },
  {
    path: "/",
    route: new UserController().router,
  },
  {
    path: "/chat",
    route: new ChatController().router,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
