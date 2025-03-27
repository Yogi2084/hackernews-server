import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import {
  DeletePostError,
  GetPostsError,
  PostStatus,
  type GetPostsResult,
  type PostCreateResult,
  
} from "./post-types";

// Create Post
export const createPost = async (parameters: {
    title: string;
    content: string;
    authorId: string | undefined; // user id from token or session
  }): Promise<PostCreateResult | PostStatus> => {
    try {
      if (!parameters.authorId) {
        return PostStatus.USER_NOT_FOUND;
      }
  
      const post = await prisma.post.create({
        data: {
          title: parameters.title,
          content: parameters.content,
          user: {
            connect: {
              id: parameters.authorId
          }
          },
        },
      });
  
      return { post };
    } catch (error) {
      console.error(error);
      return PostStatus.POST_CREATION_FAILED;
    }
  };

  // Get all Posts  for specific user

  export const GetAllPostsForUser = async (parameter: {
    userId: string;
    page: number;
    limit: number;
  }): Promise<GetPostsResult> => {
    try {
      const { userId, page, limit } = parameter;
      const skip = (page - 1) * limit;
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        throw GetPostsError.USER_NOT_FOUND;
      }
  
      // Then, check if the user has any posts
      const totalPosts = await prisma.post.count({ where: { userId } });
      if (totalPosts === 0) {
        throw GetPostsError.POSTS_NOT_FOUND;
      }
  
      // Check if the requested page exists
      const totalPages = Math.ceil(totalPosts / limit);
      if (page > totalPages) {
        throw GetPostsError.PAGE_BEYOND_LIMIT;
      }
  
      // Fetch the posts
      const posts = await prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });
  
      return { posts };
    } catch (e) {
      console.error(e);
      if (
        e === GetPostsError.USER_NOT_FOUND ||
        e === GetPostsError.POSTS_NOT_FOUND ||
        e === GetPostsError.PAGE_BEYOND_LIMIT
      ) {
        throw e;
      }
      throw GetPostsError.UNKNOWN;
    }
  };
  