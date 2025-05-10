"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const better_auth_1 = require("better-auth");
const environment_1 = require("../../environment");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_2 = require("./prisma");
const auth = (0, better_auth_1.betterAuth)({
    baseURL: environment_1.serverUrl,
    basePath: "/authentications",
    trustedOrigins: [environment_1.webClientUrl],
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            partitioned: true,
        },
    },
    database: (0, prisma_1.prismaAdapter)(prisma_2.prismaClient, {
        provider: "postgresql",
    }),
    user: {
        modelName: "User",
    },
    session: {
        modelName: "Session",
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    account: {
        modelName: "Account",
    },
    verification: {
        modelName: "Verification",
    },
    emailAndPassword: {
        enabled: true,
    },
    cookies: {
        enabled: true,
    },
});
exports.default = auth;
