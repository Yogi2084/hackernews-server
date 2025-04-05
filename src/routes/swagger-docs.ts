import { Hono } from "hono";

export const swaggerDocument = new Hono();

swaggerDocument.get("/docs", (c) => {
  return c.json({
    openapi: "3.0.0",
    info: {
      title: "Hackernews API",
      version: "2.3.7",
      description: "HackerNews clone server",
      contact: {
        name: "HackerNews-Server",
        url: "https://github.com/Yogi2084/hackernews-server",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://hackernews.ashysmoke-e7439f75.centralindia.azurecontainerapps.io",
        description: "Production server",
      },
    ],
    tags: [
      { name: "Authentication", description: "Authentication endpoints" },
      { name: "Users", description: "User management endpoints" },
      { name: "Posts", description: "Post management endpoints" },
      { name: "Likes", description: "Like management endpoints" },
      { name: "Comments", description: "Comment management endpoints" },
    ],
  });
});
