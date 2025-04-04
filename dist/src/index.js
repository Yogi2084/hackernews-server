"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const route_index_1 = require("./routes/route-index");
const node_server_1 = require("@hono/node-server");
console.log(`Server started at http://localhost:${3000}`);
(0, node_server_1.serve)(route_index_1.allRoutes);
