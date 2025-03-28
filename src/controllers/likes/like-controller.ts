import { Hono } from "hono";
import { getPagination } from "../../extras/pagination";
import {prisma} from "../../extras/prisma";
import {LikeStatus, DeleteLikeError,type CreateLike,type GetLikesResult} from "./like-types";

export { LikeStatus };
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

  

export const GetAllLikesForPost = async (parameter: {
  postId: string;
  page: number;
  limit: number;
}): Promise<GetLikesResult> => {
  try {
    const { postId, page, limit } = parameter;
    const skip = (page - 1) * limit;

    // Check if the post exists
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      throw LikeStatus.POST_NOT_FOUND;
    }

    // Check if the post has any likes
    const totalLikes = await prisma.like.count({ where: { postId } });
    if (totalLikes === 0) {
      throw LikeStatus.NO_LIKES_FOUND;
    }

    // Check if the requested page exists
    const totalPages = Math.ceil(totalLikes / limit);
    if (page > totalPages) {
      throw LikeStatus.LIKE_NOT_FOUND;
    }

    // Fetch the likes
    const likes = await prisma.like.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: 
      { user:{
        select:{
            id: true,
            name: true,
            username: true,
          },
        },
    }
    });

    return { likes };
  } catch (e) {
    console.error(e);
    if (
      e === LikeStatus.POST_NOT_FOUND ||
      e === LikeStatus.NO_LIKES_FOUND ||
      e === LikeStatus.LIKE_NOT_FOUND
    ) {
      throw e;
    }
    throw LikeStatus.UNKNOWN;
  }
};
