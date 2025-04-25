import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/route-index";

serve(allRoutes, ({ port }) => {
  console.log(`\tRunning @ http://localhost:${port}`);
});