import { Router } from "express";
import { AuthController } from "./src/controllers/auth/auth.controller";
import { ProfileController } from "./src/controllers/profile/profile.controller";
import { ConnectionController } from "./src/controllers/request/request.controller";

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
    path: "/sendConnectionRequest",
    route: new ConnectionController().router,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
