import "dotenv/config";
import { allRoutes } from "./routes/route-index";
import { serve } from "@hono/node-server";


console.log(`Server started at http://localhost:${3000}`);
serve(allRoutes);
