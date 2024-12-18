import Elysia, { t } from "elysia";

import { admin, auth } from "../../auth/auth";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../../config/api.config";
import jwt from "@elysiajs/jwt";
import { FacultysController } from "../../controller/Combo/facultys.controller";

export const FacultysRouter = (app: Elysia) => {
  const facultysController = new FacultysController();
  return app.group("/faculty", (app) =>
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
        ({ body, set }) => facultysController.Create({ body, set }),
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
          facultysController.Update({ body, set, params }),
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
        ({ params, set }) => facultysController.Delete({ params, set }),
        { beforeHandle: [auth, admin] }
      )
      .get("/", ({ set }) => facultysController.SelectAll({ set }), {
        beforeHandle: [auth, admin],
      })
      .get(
        "/:id",
        ({ set, params }) => facultysController.SelectOne({ set, params }),
        { beforeHandle: [auth] }
      )
      .get(
        "/visible",
        ({ set, query }) =>
          facultysController.SelectByVisible({ set, query }),
        {
          beforeHandle: [auth],
          query: t.Object({
            visible: t.BooleanString(),
          }),
        }
      )
  );
};
