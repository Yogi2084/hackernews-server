import { getPagination } from "../../extras/pagination";
import {prisma} from "../../extras/prisma";
import {LikeStatus, DeleteLikeError,type CreateLike,type GetLikesResult} from "./like-types";

export const createLike = async (params: {
    postId: string;
    userId: string;
  }): Promise<CreateLike> => {
    try {
      // Check weather the post exists or not
      
      const post = await prisma.post.findUnique({
        where: { id: params.postId },
      });
  
      if (!post) {
        return { status: LikeStatus.POST_NOT_FOUND };
      }
  
      // check if the user has already liked the post
      const existingLike = await prisma.like.findFirst({
        where: {
          postId: params.postId,
          userId: params.userId,
        },
      });
  
      if (existingLike) {
        return { status: LikeStatus.ALREADY_LIKED };
      }
  
      // Create a new like
      await prisma.like.create({
        data: {
          postId: params.postId,
          userId: params.userId,
        },
      });
  
      return { status: LikeStatus.LIKE_SUCCESS };
    } catch (error) {
      console.error(error);
      return { status: LikeStatus.UNKNOWN };
    }
  };

export { LikeStatus };
  