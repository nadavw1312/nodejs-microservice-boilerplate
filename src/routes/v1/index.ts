import express, { Router } from "express";
import serviceRoute from "./service.route";
const router: Router = express.Router();

const routes = [
  {
    path: "_inset_",
    route: serviceRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
