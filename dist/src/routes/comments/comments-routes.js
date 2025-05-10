"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRoutes = void 0;
const hono_1 = require("hono");
const session_middleware_1 = require("../middleware/session-middleware");
const comments_controllers_1 = require("./comments-controllers");
const comments_types_1 = require("./comments-types");
const pagination_1 = require("../../extras/pagination");
exports.commentsRoutes = new hono_1.Hono();
exports.commentsRoutes.get("/on/:postId", async (c) => {
    try {
        const postId = c.req.param("postId");
        const { page, limit } = (0, pagination_1.getPagination)(c);
        const result = await (0, comments_controllers_1.GetComments)({ postId, page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === comments_types_1.GetCommentsError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === comments_types_1.GetCommentsError.PAGE_BEYOND_LIMIT) {
            return c.json({ error: "No comments found on the requested page" }, 404);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.post("/on/:postId", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const userId = c.get("user").id;
        const { content } = await c.req.json();
        const result = await (0, comments_controllers_1.CreateComment)({ postId, userId, content });
        return c.json(result, 201);
    }
    catch (error) {
        if (error === comments_types_1.CreateCommentError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === comments_types_1.CreateCommentError.INVALID_INPUT) {
            return c.json({ error: "Comment content is required" }, 400);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.patch("/:commentId", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const commentId = c.req.param("commentId");
        const userId = c.get("user").id;
        const { content } = await c.req.json();
        const result = await (0, comments_controllers_1.UpdateComment)({ commentId, userId, content });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === comments_types_1.UpdateCommentError.COMMENT_NOT_FOUND) {
            return c.json({ error: "Comment not found" }, 404);
        }
        if (error === comments_types_1.UpdateCommentError.INVALID_INPUT) {
            return c.json({ error: "Comment content is required" }, 400);
        }
        if (error === comments_types_1.UpdateCommentError.NO_CHANGES) {
            return c.json({ error: "No changes detected in comment content" }, 400);
        }
        if (error === comments_types_1.UpdateCommentError.UNAUTHORIZED) {
            return c.json({ error: "You are not authorized to edit this comment" }, 403);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.delete("/:commentId", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const commentId = c.req.param("commentId");
        const userId = c.get("user").id;
        await (0, comments_controllers_1.DeleteComment)({ commentId, userId });
        return c.json({ message: "Comment deleted successfully" }, 200);
    }
    catch (error) {
        if (error === comments_types_1.DeleteCommentError.COMMENT_NOT_FOUND) {
            return c.json({ error: "Comment not found" }, 404);
        }
        if (error === comments_types_1.DeleteCommentError.UNAUTHORIZED) {
            return c.json({ error: "You can only delete your own comments" }, 403);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.get("/on/posts", async (c) => {
    try {
        const { page, limit } = (0, pagination_1.getPagination)(c);
        const result = await (0, comments_controllers_1.GetCommentsOnPosts)({ page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === comments_types_1.GetCommentsOnPostsError.PAGE_BEYOND_LIMIT) {
            return c.json({ error: "No comments found on the requested page" }, 404);
        }
        if (error === comments_types_1.GetCommentsOnPostsError.COMMENTS_NOT_FOUND) {
            return c.json({ error: "No comments found" }, 404);
        }
        if (error === comments_types_1.GetCommentsOnPostsError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.get("/me", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const userId = c.get("user")?.id;
        const result = await (0, comments_controllers_1.GetCommentsOnMe)({ userId });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === comments_types_1.GetCommentsOnMeError.COMMENTS_NOT_FOUND) {
            return c.json({ error: "No comments found" }, 404);
        }
        if (error === comments_types_1.GetCommentsOnMeError.PAGE_BEYOND_LIMIT) {
            return c.json({ error: "No comments found on the requested page" }, 404);
        }
        if (error === comments_types_1.GetCommentsOnMeError.USER_NOT_FOUND) {
            return c.json({ error: "User not found" }, 404);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.get("/by/:slug", async (c) => {
    try {
        const { slug } = c.req.param();
        const { page, limit } = (0, pagination_1.getPagination)(c);
        const result = await (0, comments_controllers_1.GetCommentsOnUser)({ name: slug, page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === comments_types_1.GetCommentsOnMeError.COMMENTS_NOT_FOUND) {
            return c.json({ error: "No comments found for this user" }, 404);
        }
        if (error === comments_types_1.GetCommentsOnMeError.PAGE_BEYOND_LIMIT) {
            return c.json({ error: "No comments found on the requested page" }, 404);
        }
        if (error === comments_types_1.GetCommentsOnMeError.USER_NOT_FOUND) {
            return c.json({ error: "User not found" }, 404);
        }
        if (error === comments_types_1.GetCommentsOnUserError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
