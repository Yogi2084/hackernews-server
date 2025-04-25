import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";

import { swaggerUI } from "@hono/swagger-ui";
import { swaggerDocument } from "./swagger-docs";

import { usersRoutes } from "./user-routes";
import { postsRoutes } from "./posts-routes";
import { likesRoutes } from "./likes-routes";
import { commentsRoutes } from "./comments-routes";
import { cors } from "hono/cors";
import { authRoute } from "./middleware/session-middleware";

export const allRoutes = new Hono();

allRoutes.use(
  cors({
    origin: "http://localhost:4000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

allRoutes.get("/ui", swaggerUI({ url: "/docs" }));
allRoutes.route("/", swaggerDocument);
allRoutes.route("/authentication", authenticationRoutes);
allRoutes.route("/api/auth", authRoute);
allRoutes.route("/users", usersRoutes)
allRoutes.route("/posts", postsRoutes)
allRoutes.route("/likes", likesRoutes)
allRoutes.route("/comments", commentsRoutes);
