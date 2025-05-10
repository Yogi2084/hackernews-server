"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsers = exports.GetMe = void 0;
const prisma_1 = require("../../lib/prisma");
const users_types_1 = require("./users-types");
const GetMe = async (parameters) => {
    try {
        const { userId, page, limit } = parameters;
        const skip = (page - 1) * limit;
        const totalUsers = await prisma_1.prismaClient.user.count();
        if (totalUsers === 0) {
            throw users_types_1.GetMeError.USER_NOT_FOUND;
        }
        const totalPages = Math.ceil(totalUsers / limit);
        if (page > totalPages) {
            throw users_types_1.GetMeError.PAGE_BEYOND_LIMIT;
        }
        const user = await prisma_1.prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                about: true,
                createdAt: true,
                updatedAt: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                        userId: true,
                    },
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        postId: true,
                        createdAt: true,
                        updatedAt: true,
                        userId: true,
                    },
                },
                likes: {
                    select: {
                        id: true,
                        postId: true,
                        createdAt: true,
                        updatedAt: true,
                        userId: true,
                    },
                },
            },
        });
        if (!user) {
            throw users_types_1.GetMeError.USER_NOT_FOUND;
        }
        const result = {
            user: {
                id: user.id,
                name: user.name || "",
                about: user.about || "",
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                posts: user.posts || [],
                comments: user.comments
                    ? user.comments
                        .filter((comment) => comment.postId !== null)
                        .map((comment) => ({
                        ...comment,
                        postId: comment.postId,
                    }))
                    : [],
                likes: user.likes || [],
            },
        };
        return result;
    }
    catch (e) {
        console.error(e);
        throw users_types_1.GetMeError.UNKNOWN;
    }
};
exports.GetMe = GetMe;
const GetUsers = async (parameter) => {
    try {
        const { page, limit } = parameter;
        const skip = (page - 1) * limit;
        const totalUsers = await prisma_1.prismaClient.user.count();
        if (totalUsers === 0) {
            throw users_types_1.GetUsersError.USERS_NOT_FOUND;
        }
        const totalPages = Math.ceil(totalUsers / limit);
        if (page > totalPages) {
            throw users_types_1.GetUsersError.PAGE_BEYOND_LIMIT;
        }
        const users = await prisma_1.prismaClient.user.findMany({
            orderBy: { name: "asc" },
            skip,
            take: limit,
        });
        return { users };
    }
    catch (e) {
        console.error(e);
        if (e === users_types_1.GetUsersError.USERS_NOT_FOUND ||
            e === users_types_1.GetUsersError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw users_types_1.GetUsersError.UNKNOWN;
    }
};
exports.GetUsers = GetUsers;
