"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLike = exports.GetAllLikesForPost = exports.createLike = exports.LikeStatus = void 0;
const prisma_1 = require("../../extras/prisma");
const like_types_1 = require("./like-types");
Object.defineProperty(exports, "LikeStatus", { enumerable: true, get: function () { return like_types_1.LikeStatus; } });
const createLike = async (params) => {
    try {
        // Check weather the post exists or not
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: params.postId },
        });
        if (!post) {
            return { status: like_types_1.LikeStatus.POST_NOT_FOUND };
        }
        // check if the user has already liked the post
        const existingLike = await prisma_1.prisma.like.findFirst({
            where: {
                postId: params.postId,
                userId: params.userId,
            },
        });
        if (existingLike) {
            return { status: like_types_1.LikeStatus.ALREADY_LIKED };
        }
        // Create a new like
        await prisma_1.prisma.like.create({
            data: {
                postId: params.postId,
                userId: params.userId,
            },
        });
        return { status: like_types_1.LikeStatus.LIKE_SUCCESS };
    }
    catch (error) {
        console.error(error);
        return { status: like_types_1.LikeStatus.UNKNOWN };
    }
};
exports.createLike = createLike;
const GetAllLikesForPost = async (parameter) => {
    try {
        const { postId, page, limit } = parameter;
        const skip = (page - 1) * limit;
        // Check if the post exists
        const postExists = await prisma_1.prisma.post.findUnique({ where: { id: postId } });
        if (!postExists) {
            throw like_types_1.LikeStatus.POST_NOT_FOUND;
        }
        // Check if the post has any likes
        const totalLikes = await prisma_1.prisma.like.count({ where: { postId } });
        if (totalLikes === 0) {
            throw like_types_1.LikeStatus.NO_LIKES_FOUND;
        }
        // Check if the requested page exists
        const totalPages = Math.ceil(totalLikes / limit);
        if (page > totalPages) {
            throw like_types_1.LikeStatus.LIKE_NOT_FOUND;
        }
        // Fetch the likes
        const likes = await prisma_1.prisma.like.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: { user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
            }
        });
        return { likes };
    }
    catch (e) {
        console.error(e);
        if (e === like_types_1.LikeStatus.POST_NOT_FOUND ||
            e === like_types_1.LikeStatus.NO_LIKES_FOUND ||
            e === like_types_1.LikeStatus.LIKE_NOT_FOUND) {
            throw e;
        }
        throw like_types_1.LikeStatus.UNKNOWN;
    }
};
exports.GetAllLikesForPost = GetAllLikesForPost;
const deleteLike = async (params) => {
    try {
        const { postId, userId } = params;
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            return { status: like_types_1.DeleteLikeError.POST_NOT_FOUND };
        }
        const like = await prisma_1.prisma.like.findFirst({
            where: { postId, userId },
        });
        if (!like) {
            return { status: like_types_1.DeleteLikeError.LIKE_NOT_FOUND };
        }
        await prisma_1.prisma.like.delete({
            where: { id: like.id },
        });
        return { status: like_types_1.DeleteLikeError.DELETE_SUCCESS };
    }
    catch (error) {
        console.error(error);
        return { status: like_types_1.DeleteLikeError.DELETE_FAILED };
    }
};
exports.deleteLike = deleteLike;
