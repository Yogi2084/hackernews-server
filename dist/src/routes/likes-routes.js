"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesRoutes = void 0;
const hono_1 = require("hono");
const token_middleware_1 = require("./middleware/token-middleware");
const pagination_1 = require("../extras/pagination");
const like_controller_1 = require("../controllers/likes/like-controller");
const like_types_1 = require("../controllers/likes/like-types");
exports.likesRoutes = new hono_1.Hono();
exports.likesRoutes.post("/on/:postId", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId");
        const postId = context.req.param("postId");
        if (!userId) {
            return context.json({ error: "Unauthorized" }, 401);
        }
        const result = await (0, like_controller_1.createLike)({ postId, userId });
        if (result.status === like_controller_1.LikeStatus.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result.status === like_controller_1.LikeStatus.ALREADY_LIKED) {
            return context.json({ error: "You have already liked this post" }, 200);
        }
        if (result.status === like_controller_1.LikeStatus.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
        return context.json({ message: "Post liked successfully" }, 201);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
exports.likesRoutes.get("/on/:postId", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        if (!postId) {
            return context.json({ error: "Post ID is required" }, 400);
        }
        const { page, limit } = (0, pagination_1.getPagination)(context);
        const result = await (0, like_controller_1.GetAllLikesForPost)({ postId, page, limit });
        return context.json(result, 200);
    }
    catch (error) {
        console.error(error);
        if (error === like_controller_1.LikeStatus.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (error === like_controller_1.LikeStatus.NO_LIKES_FOUND) {
            return context.json({ error: "No likes found for the post" }, 404);
        }
        if (error === like_controller_1.LikeStatus.LIKE_NOT_FOUND) {
            return context.json({ error: "No likes found on the requested page" }, 404);
        }
        return context.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.delete("/on/:postId", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId"); // From tokenMiddleware 
        const postId = context.req.param("postId");
        if (!postId) {
            return context.json({ error: "Post ID is required" }, 400);
        }
        // Delete the like
        const result = await (0, like_controller_1.deleteLike)({ postId, userId });
        return context.json(result, 200);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: like_types_1.DeleteLikeError.UNKNOWN }, 500);
    }
});
