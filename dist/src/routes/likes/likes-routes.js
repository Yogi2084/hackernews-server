"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesRoutes = void 0;
const hono_1 = require("hono");
const session_middleware_1 = require("../middleware/session-middleware");
const likes_controllers_1 = require("./likes-controllers");
const likes_types_1 = require("./likes-types");
const pagination_1 = require("../../extras/pagination");
exports.likesRoutes = new hono_1.Hono();
exports.likesRoutes.get("/on/:postId", async (c) => {
    try {
        const postId = c.req.param("postId");
        const { page, limit } = (0, pagination_1.getPagination)(c);
        const result = await (0, likes_controllers_1.GetLikes)({ postId, page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === likes_types_1.GetLikesError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === likes_types_1.GetLikesError.LIKES_NOT_FOUND) {
            return c.json({ error: "No likes found on this post" }, 404);
        }
        if (error === likes_types_1.GetLikesError.PAGE_NOT_FOUND) {
            return c.json({ error: "No likes found on the requested page" }, 404);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.post("/on/:postId", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const userId = c.get("user").id;
        const result = await (0, likes_controllers_1.CreateLike)({ postId, userId });
        return c.json(result, 201);
    }
    catch (error) {
        if (error === likes_types_1.LikePostError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === likes_types_1.LikePostError.ALREADY_LIKED) {
            return c.json({ error: "You have already liked this post" }, 400);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.delete("/on/:postId", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const userId = c.get("user").id;
        const result = await (0, likes_controllers_1.DeleteLike)({ postId, userId });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === likes_types_1.DeleteLikeError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === likes_types_1.DeleteLikeError.LIKE_NOT_FOUND) {
            return c.json({ error: "Like not found" }, 404);
        }
        if (error === likes_types_1.DeleteLikeError.USER_NOT_FOUND) {
            return c.json({ error: "You can only remove your own likes" }, 403);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.get("/me", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const userId = c.get("user")?.id;
        const result = await (0, likes_controllers_1.GetLikesOnMe)({ userId });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === likes_types_1.GetLikesOnMeError.LIKES_NOT_FOUND) {
            return c.json({ error: "No likes found" }, 404);
        }
        if (error === likes_types_1.GetLikesOnMeError.PAGE_NOT_FOUND) {
            return c.json({ error: "No likes found on the requested page" }, 404);
        }
        if (error === likes_types_1.GetLikesOnMeError.USER_NOT_FOUND) {
            return c.json({ error: "User not found" }, 404);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.get("/by/:slug", async (c) => {
    try {
        const { slug } = c.req.param();
        const { page, limit } = (0, pagination_1.getPagination)(c);
        const result = await (0, likes_controllers_1.GetLikesOnUser)({ name: slug, page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === likes_types_1.GetLikesOnMeError.LIKES_NOT_FOUND) {
            return c.json({ error: "No likes found for this user" }, 404);
        }
        if (error === likes_types_1.GetLikesOnUserError.USER_NOT_FOUND) {
            return c.json({ error: "User not found" }, 404);
        }
        if (error === likes_types_1.GetLikesOnUserError.PAGE_NOT_FOUND) {
            return c.json({ error: "No likes found on the requested page" }, 404);
        }
        if (error === likes_types_1.GetLikesOnUserError.POST_NOT_FOUND) {
            return c.json({ error: "No likes found on the requested page" }, 404);
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
