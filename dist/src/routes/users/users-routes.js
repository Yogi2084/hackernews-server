"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const hono_1 = require("hono");
const users_controllers_1 = require("./users-controllers");
const users_types_1 = require("./users-types");
const pagination_1 = require("../../extras/pagination");
const session_middleware_1 = require("../middleware/session-middleware");
const prisma_1 = require("../../lib/prisma");
exports.usersRoutes = new hono_1.Hono();
exports.usersRoutes.all("/me", session_middleware_1.authenticationMiddleware, async (context) => {
    const user = context.get("user");
    const userId = user?.id;
    if (!userId) {
        return context.json({ error: "User not found" }, 404);
    }
    if (context.req.method === "GET") {
        try {
            const { page, limit } = (0, pagination_1.getPagination)(context);
            const result = await (0, users_controllers_1.GetMe)({ userId, page, limit });
            if (!result) {
                return context.json({ error: "User not found" }, 404);
            }
            return context.json(result, 200);
        }
        catch (error) {
            if (error === users_types_1.GetMeError.USER_NOT_FOUND) {
                return context.json({ error: "User not found" }, 404);
            }
            if (error === users_types_1.GetMeError.UNKNOWN) {
                return context.json({ error: "Unknown error" }, 500);
            }
        }
    }
    else if (context.req.method === "POST") {
        try {
            const { about } = await context.req.json();
            if (!about) {
                return context.json({ error: "About field is required" }, 400);
            }
            const updatedUser = await prisma_1.prismaClient.user.update({
                where: { id: userId },
                data: { about },
            });
            return context.json({ user: updatedUser }, 200);
        }
        catch (error) {
            console.error("Error updating About:", error);
            return context.json({ error: "Failed to update About" }, 500);
        }
    }
});
exports.usersRoutes.get("/", session_middleware_1.authenticationMiddleware, async (context) => {
    try {
        const { page, limit } = (0, pagination_1.getPagination)(context);
        const result = await (0, users_controllers_1.GetUsers)({ page, limit });
        if (!result) {
            return context.json({ error: "No users found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        if (error === users_types_1.GetUsersError.USERS_NOT_FOUND) {
            return context.json({ error: "No users found" }, 404);
        }
        if (error === users_types_1.GetUsersError.PAGE_BEYOND_LIMIT) {
            return context.json({ error: "No users found on the page requested" }, 404);
        }
        if (error === users_types_1.GetUsersError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});
