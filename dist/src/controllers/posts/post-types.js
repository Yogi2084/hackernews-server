"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePostError = exports.GetPostsError = exports.PostStatus = void 0;
var PostStatus;
(function (PostStatus) {
    PostStatus["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    PostStatus["POST_CREATED"] = "POST_CREATED";
    PostStatus["POST_CREATION_FAILED"] = "POST_CREATION_FAILED";
    PostStatus["SUCCESS"] = "SUCCESS";
    PostStatus["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    PostStatus["DELETE_POST_FAILED"] = "DELETE_POST_FAILED";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
var GetPostsError;
(function (GetPostsError) {
    GetPostsError["NO_POSTS_FOUND"] = "NO_POSTS_FOUND";
    GetPostsError["UNKNOWN"] = "UNKNOWN";
    GetPostsError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    GetPostsError["POSTS_NOT_FOUND"] = "POSTS_NOT_FOUND";
    GetPostsError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
})(GetPostsError || (exports.GetPostsError = GetPostsError = {}));
var DeletePostError;
(function (DeletePostError) {
    DeletePostError["UNAUTHORIZED"] = "UNAUTHORIZED";
    DeletePostError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    DeletePostError["DELETE_SUCCESS"] = "DELETE_SUCCESS";
    DeletePostError["DELETE_FAILED"] = "DELETE_FAILED";
    DeletePostError["UNKNOWN"] = "UNKNOWN";
})(DeletePostError || (exports.DeletePostError = DeletePostError = {}));
