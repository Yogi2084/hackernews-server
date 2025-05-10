"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production") {
    require("dotenv/config"); // Load .env only in development
}
const node_server_1 = require("@hono/node-server");
const routes_index_1 = require("./routes/routes-index");
(0, node_server_1.serve)(routes_index_1.allRoutes, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
