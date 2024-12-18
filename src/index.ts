import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import swagger from "@elysiajs/swagger";
import { checkConnectionDATABASE } from "./DB/prismaClient";
import { enviroment, SERVER_PORT } from "./config/api.config";
import redis from "./DB/redis";
import { IndexRouter } from "./routers/index.router";


const app = new Elysia()

  .use(
    cors({
      credentials: true,
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )

  .use(
    logger({
      level: enviroment === "deployment" ? "info" : "debug",
    })
  )

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

  .get("/health", ({}) => {
    return { status: "ok", message: "server ok" };
  })

  .use(IndexRouter)
  .all("*", ({ set }) => {
    set.status = 400;
    return { error: "Not found" };
  });
await redis.flushdb();



app.listen(SERVER_PORT, async () => {
  console.log("server in running on port", app.server?.url.href);
  await checkConnectionDATABASE();
});
