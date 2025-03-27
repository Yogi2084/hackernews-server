import type { Post } from "@prisma/client";
export type PostCreateResult = {
    post: Post;
  };
  
  export enum PostStatus {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    POST_CREATED = "POST_CREATED",
    POST_CREATION_FAILED = "POST_CREATION_FAILED",
    SUCCESS = "SUCCESS",
    POST_NOT_FOUND = "POST_NOT_FOUND",
    DELETE_POST_FAILED = "DELETE_POST_FAILED",
  }
  
  export type GetPostsResult = {
    posts: Post[];
  };
  
  export enum GetPostsError {
    NO_POSTS_FOUND = "NO_POSTS_FOUND",
    UNKNOWN = "UNKNOWN",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    POSTS_NOT_FOUND = "POSTS_NOT_FOUND",
    PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  }
  
  export enum DeletePostError {
    UNAUTHORIZED = "UNAUTHORIZED",
    POST_NOT_FOUND = "POST_NOT_FOUND",
    DELETE_SUCCESS = "DELETE_SUCCESS",
    DELETE_FAILED = "DELETE_FAILED",
    UNKNOWN = "UNKNOWN",
  }
  