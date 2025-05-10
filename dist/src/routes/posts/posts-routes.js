"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRoutes = void 0;
const hono_1 = require("hono");
const session_middleware_1 = require("../middleware/session-middleware");
const posts_controllers_1 = require("./posts-controllers");
const posts_types_1 = require("./posts-types");
const pagination_1 = require("../../extras/pagination");
exports.postsRoutes = new hono_1.Hono();
exports.postsRoutes.get("/search", async (c) => {
    const { query } = c.req.query();
    console.log("Received query:", query);
    const { page, limit } = (0, pagination_1.getPagination)(c);
    try {
        const result = await (0, posts_controllers_1.SearchPosts)({ query, page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === posts_types_1.SearchPostsError.QUERY_REQUIRED) {
            return c.json({ error: "Query is required!" }, 400);
        }
        if (error === posts_types_1.SearchPostsError.POSTS_NOT_FOUND) {
            return c.json({ error: "Post not found!" }, 404);
        }
        if (error === posts_types_1.SearchPostsError.PAGE_BEYOND_LIMIT) {
            return c.json({ error: "No posts found on the requested page!" }, 404);
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
exports.postsRoutes.get("/", async (context) => {
    try {
        const { page, limit } = (0, pagination_1.getPagination)(context);
        const result = await (0, posts_controllers_1.GetPosts)({ page, limit });
        return context.json(result, { status: 200 });
    }
    catch (error) {
        if (error === posts_types_1.GetPostsError.POSTS_NOT_FOUND) {
            return context.json({ error: "No posts found in the system!" }, { status: 404 });
        }
        if (error === posts_types_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            return context.json({ error: "No posts found on the requested page!" }, { status: 404 });
        }
        return context.json({ error: "Unknown error!" }, { status: 500 });
    }
});
exports.postsRoutes.get("/me", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const userId = c.get("user")?.name;
        const { page, limit } = (0, pagination_1.getPagination)(c);
        const result = await (0, posts_controllers_1.GetUserPosts)({ userId, page, limit });
        return c.json(result, { status: 200 });
    }
    catch (error) {
        if (error === posts_types_1.GetPostsError.POSTS_NOT_FOUND) {
            return c.json({ error: "You haven't created any posts yet!" }, 404);
        }
        if (error === posts_types_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            return c.json({ error: "No posts found on the requested page!" }, 404);
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
exports.postsRoutes.post("/", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const userId = c.get("user").id;
        const { title, content } = await c.req.json();
        const result = await (0, posts_controllers_1.CreatePost)({ userId, title, content });
        return c.json(result, 201);
    }
    catch (error) {
        if (error === posts_types_1.CreatePostError.TITLE_REQUIRED) {
            return c.json({ error: "Title is required!" }, 400);
        }
        if (error === posts_types_1.CreatePostError.USER_NOT_FOUND) {
            return c.json({ error: "User not found!" }, 404);
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
exports.postsRoutes.get("/:postId", async (c) => {
    try {
        const postId = c.req.param("postId");
        const result = await (0, posts_controllers_1.GetPostById)({ postId });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === posts_types_1.GetPostByIdError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found!" }, 404);
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
exports.postsRoutes.delete("/:postId", session_middleware_1.authenticationMiddleware, async (c) => {
    try {
        const userId = c.get("user").id;
        const postId = c.req.param("postId");
        await (0, posts_controllers_1.DeletePost)({ postId, userId });
        return c.json({ message: "Post deleted successfully" }, 200);
    }
    catch (error) {
        if (error === posts_types_1.DeletePostError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found!" }, 404);
        }
        if (error === posts_types_1.DeletePostError.USER_NOT_FOUND) {
            return c.json({ error: "User not found!" });
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
exports.postsRoutes.get("/by/:name", async (c) => {
    try {
        const { name } = c.req.param();
        const { page, limit } = (0, pagination_1.getPagination)(c);
        const result = await (0, posts_controllers_1.GetUserPostsBySlug)({ name, page, limit });
        if (result.posts.length === 0) {
            return c.json({ error: "This user hasn't created any posts yet!" }, 404);
        }
        return c.json(result, 200);
    }
    catch (error) {
        if (error === posts_types_1.GetPostsError.POSTS_NOT_FOUND) {
            return c.json({ error: "This user hasn't created any posts yet!" }, 404);
        }
        if (error === posts_types_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            return c.json({ error: "No posts found on the requested page!" }, 404);
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
