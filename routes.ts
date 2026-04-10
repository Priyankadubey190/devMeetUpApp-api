import { Router } from "express";
import { AuthController } from "./src/controllers/auth/auth.controller";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: new AuthController().router,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
