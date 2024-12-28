import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import swagger from "@elysiajs/swagger";
import { checkConnectionDATABASE } from "./DB/prismaClient";
import { enviroment, SERVER_PORT } from "./config/api.config";
import redis from "./DB/redis";
import { IndexRouter } from "./routers/index.router";


const app = new Elysia()

  // Enable CORS with specific settings
  .use(
    cors({
      credentials: true,
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )

  // Enable logging with different levels based on environment
  .use(
    logger({
      level: enviroment === "deployment" ? "info" : "debug",
    })
  )

  // Enable Swagger for API documentation
  .use(
    swagger({
      documentation: {
        info: {
          title: "API Documentation",
          version: "1.0.0",
        },
      },
    })
  )

  // Health check endpoint
  .get("/health", ({}) => {
    return { status: "ok", message: "server ok" };
  })

  // Use the main router for handling routes
  .use(IndexRouter)

  // Handle all other routes with a 400 status code
  .all("*", ({ set }) => {
    set.status = 400;
    return { error: "Not found" };
  });

// Clear Redis database
await redis.flushdb();

// Start the server and check database connection
app.listen(SERVER_PORT, async () => {
  console.log("server is running on port", app.server?.url.href);
  await checkConnectionDATABASE();
});