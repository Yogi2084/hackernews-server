"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationsRoutes = void 0;
const auth_1 = require("../../lib/auth");
const session_middleware_1 = require("../middleware/session-middleware");
exports.authenticationsRoutes = (0, session_middleware_1.createUnsecureRoute)();
exports.authenticationsRoutes.use((c) => {
    return auth_1.default.handler(c.req.raw);
});
