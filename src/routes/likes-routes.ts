import { Hono } from "hono";
import { tokenMiddleware } from "./middleware/token-middleware";
import { getPagination } from "../extras/pagination";
import { LikeStatus, createLike } from "../controllers/likes/like-controller";

export const likesRoutes = new Hono();


likesRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
    try {
      const userId = context.get("userId");
      const postId = context.req.param("postId");
      if (!userId) {
        return context.json({ error: "Unauthorized" }, 401);
      }
  
      const result = await createLike({ postId, userId });
  
      if (result.status === LikeStatus.POST_NOT_FOUND) {
        return context.json({ error: "Post not found" }, 404);
      }
  
      if (result.status === LikeStatus.ALREADY_LIKED) {
        return context.json({ error: "You have already liked this post" }, 200);
      }
  
      if (result.status === LikeStatus.UNKNOWN) {
        return context.json({ error: "Unknown error" }, 500);
      }
  
      return context.json({ message: "Post liked successfully" }, 201);
    } catch (error) {
      console.error(error);
      return context.json({ error: "Server error" }, 500);
    }
  });



