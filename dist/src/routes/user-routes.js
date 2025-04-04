"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const hono_1 = require("hono");
const token_middleware_1 = require("./middleware/token-middleware");
const user_controller_1 = require("../controllers/users/user-controller");
const user_type_1 = require("../controllers/users/user-type");
const pagination_1 = require("../extras/pagination");
exports.usersRoutes = new hono_1.Hono();
exports.usersRoutes.get("/me", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId");
        const result = await (0, user_controller_1.GetMe)({ userId });
        if (!result) {
            return context.json({ error: "User not found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        if (error === user_type_1.GetMeError.USER_NOT_FOUND) {
            return context.json({ error: "User not found" }, 404);
        }
        if (error === user_type_1.GetMeError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});
exports.usersRoutes.get("/all", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const { page, limit } = (0, pagination_1.getPagination)(context);
        const result = await (0, user_controller_1.GetAllUsers)({ page, limit });
        if (!result) {
            return context.json({ error: "Users not found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        if (error === user_type_1.GetAllUsersError.NO_USERS_FOUND) {
            return context.json({ error: "Users not found" }, 404);
        }
        if (error === user_type_1.GetAllUsersError.PAGE_BEYOND_LIMIT) {
            return context.json({ error: "No users found on the page requested]" }, 404);
        }
        if (error === user_type_1.GetAllUsersError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});
