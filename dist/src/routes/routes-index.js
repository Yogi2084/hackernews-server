"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const hono_1 = require("hono");
const authentication_routes_1 = require("./authentications/authentication-routes");
const users_routes_1 = require("./users/users-routes");
const posts_routes_1 = require("./posts/posts-routes");
const likes_routes_1 = require("./likes/likes-routes");
const comments_routes_1 = require("./comments/comments-routes");
const cors_1 = require("hono/cors");
const environment_1 = require("../../environment");
exports.allRoutes = new hono_1.Hono();
exports.allRoutes.use((0, cors_1.cors)({
    origin: environment_1.webClientUrl,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
}));
exports.allRoutes.route("/authentications", authentication_routes_1.authenticationsRoutes);
exports.allRoutes.route("/users", users_routes_1.usersRoutes);
exports.allRoutes.route("/posts", posts_routes_1.postsRoutes);
exports.allRoutes.route("/likes", likes_routes_1.likesRoutes);
exports.allRoutes.route("/comments", comments_routes_1.commentsRoutes);
