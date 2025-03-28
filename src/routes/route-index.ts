import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { logger } from "hono/logger";
import { usersRoutes } from "./user-routes";
import { postsRoutes } from "./posts-routes";
import { likesRoutes } from "./likes-routes";
import { commentsRoutes } from "./comments-routes";

export const allRoutes = new Hono();

allRoutes.use(logger())

allRoutes.route("/authentication", authenticationRoutes);

allRoutes.route("/users", usersRoutes)
allRoutes.route("/posts", postsRoutes)
allRoutes.route("/likes", likesRoutes)
allRoutes.route("/comments", commentsRoutes);

allRoutes.get(
  "/health",
  (context) => {
    console.log("Health checked");
    return context.json({ message: "OK" }, 200);
  }
);