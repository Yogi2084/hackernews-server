import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";

import { swaggerUI } from "@hono/swagger-ui";
import { swaggerDocument } from "./swagger-docs";

import { usersRoutes } from "./user-routes";
import { postsRoutes } from "./posts-routes";
import { likesRoutes } from "./likes-routes";
import { commentsRoutes } from "./comments-routes";
import { logger } from "hono/logger";

export const allRoutes = new Hono();

allRoutes.use(logger())

allRoutes.get("/ui", swaggerUI({ url: "/docs" }));
allRoutes.route("/", swaggerDocument);
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