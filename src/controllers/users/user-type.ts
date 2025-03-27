import type { User } from "@prisma/client";

export type GetMeResult = {
  user: User;
};

export enum GetMeError {
    UNKNOWN = "UNKNOWN",
    USER_NOT_FOUND = "USER_NOT_FOUND",
}

export type GetAllUsersResult = {
    users: User[];
}

export enum GetAllUsersError {
    NO_USERS_FOUND = "NO_USERS_FOUND",
    UNKNOWN = "UNKNOWN",
    USERS_NOT_FOUND = "USERS_NOT_FOUND",
    PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
}