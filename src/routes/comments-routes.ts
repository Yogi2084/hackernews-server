import { Hono } from "hono";
import { tokenMiddleware } from "./middleware/token-middleware";
import { CreateComment } from "../controllers/comments/comment-controller";
import { CreateCommentError } from "../controllers/comments/comment-types";

export const commentsRoutes = new Hono();
commentsRoutes.post("/on/:postId", tokenMiddleware, async (c) => {
    try {
      const postId = c.req.param("postId");
      const userId = c.get("userId");
      const { content } = await c.req.json();
      const result = await CreateComment({ postId, userId, content });
      return c.json(result, 201);
    } catch (error) {
      if (error === CreateCommentError.POST_NOT_FOUND) {
        return c.json({ error: "Post not found" }, 404);
      }
      if (error === CreateCommentError.INVALID_INPUT) {
        return c.json({ error: "Comment content is required" }, 400);
      }
      return c.json({ error: "Unknown error" }, 500);
    }
  }); 