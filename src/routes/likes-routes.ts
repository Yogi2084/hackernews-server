import { Hono } from "hono";
import { tokenMiddleware } from "./middleware/token-middleware";
import { getPagination } from "../extras/pagination";
import { GetAllLikesForPost, LikeStatus, createLike } from "../controllers/likes/like-controller";


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


  likesRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
    try {
      const postId = context.req.param("postId");
      if (!postId) {
        return context.json({ error: "Post ID is required" }, 400);
      }
  
      const { page, limit } = getPagination(context);
      const result = await GetAllLikesForPost({ postId, page, limit });
  
      return context.json(result, 200);
    } catch (error) {
      console.error(error);
      if (error === LikeStatus.POST_NOT_FOUND) {
        return context.json({ error: "Post not found" }, 404);
      }
      if (error === LikeStatus.NO_LIKES_FOUND) {
        return context.json({ error: "No likes found for the post" }, 404);
      }
      if (error === LikeStatus.LIKE_NOT_FOUND) {
        return context.json({ error: "No likes found on the requested page" }, 404);
      }
      return context.json({ error: "Unknown error" }, 500);
    }
  });
