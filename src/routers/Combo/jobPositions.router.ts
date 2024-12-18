import Elysia, { t } from "elysia";

import { admin, auth } from "../../auth/auth";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../../config/api.config";
import jwt from "@elysiajs/jwt";
import { JobPositionsController } from "../../controller/Combo/jobPositions.controller";

export const JobPositionsRouter = (app: Elysia) => {
  const jobPositionsController = new JobPositionsController();
  return app.group("/jobPositions", (app) =>
    app
      .use(
        jwt({
          secret: JWT_SECRET_KEY!,
          exp: JWT_TIMEOUT!,
          name: "jwt",
        })
      )
      .use(
        jwt({
          secret: JWT_SECRET_KEY_REFRESH!,
          exp: JWT_TIMEOUT_REFRESH!,
          name: "jwt_refresh",
        })
      )
      .post(
        "/",
        ({ body, set }) => jobPositionsController.Create({ body, set }),
        {
          beforeHandle: [auth],
          body: t.Object({
            name: t.String(),
            visible: t.Optional(t.BooleanString()),
          }),
        }
      )
      .put(
        "/:id",
        ({ body, set, params }) =>
          jobPositionsController.Update({ body, set, params }),
        {
          beforeHandle: [auth, admin],
          body: t.Object({
            name: t.Optional(t.String()),
            userId: t.Optional(t.String()),
            visible: t.Optional(t.BooleanString()),
          }),
        }
      )
      .delete(
        "/:id",
        ({ params, set }) => jobPositionsController.Delete({ params, set }),
        { beforeHandle: [auth, admin] }
      )
      .get("/", ({ set }) => jobPositionsController.SelectAll({ set }), {
        beforeHandle: [auth, admin],
      })
      .get(
        "/:id",
        ({ set, params }) => jobPositionsController.SelectOne({ set, params }),
        { beforeHandle: [auth] }
      )
      .get(
        "/visible",
        ({ set, query }) =>
          jobPositionsController.SelectByVisible({ set, query }),
        {
          beforeHandle: [auth],
          query: t.Object({
            visible: t.BooleanString(),
          }),
        }
      )
  );
};
