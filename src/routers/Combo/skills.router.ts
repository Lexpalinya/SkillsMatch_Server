import Elysia, { t } from "elysia";

import { admin, auth } from "../../auth/auth";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../../config/api.config";
import jwt from "@elysiajs/jwt";
import { SkillsController } from "../../controller/Combo/skills.controller";

export const SkillsRouter = (app: Elysia) => {
  const skillsController = new SkillsController();
  return app.group("/skills", (app) =>
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
      .post("/", ({ body, set }) => skillsController.Create({ body, set }), {
        beforeHandle: [auth],
        body: t.Object({
          name: t.String(),
          visible: t.Optional(t.BooleanString()),
        }),
      })
      .put(
        "/:id",
        ({ body, set, params }) =>
          skillsController.Update({ body, set, params }),
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
        ({ params, set }) => skillsController.Delete({ params, set }),
        { beforeHandle: [auth, admin] }
      )
      .get("/", ({ set }) => skillsController.SelectAll({ set }), {
        beforeHandle: [auth, admin],
      })
      .get(
        "/:id",
        ({ set, params }) => skillsController.SelectOne({ set, params }),
        { beforeHandle: [auth] }
      )
      .get(
        "/visible",
        ({ set, query }) => skillsController.SelectByVisible({ set, query }),
        {
          beforeHandle: [auth],
          query: t.Object({
            visible: t.BooleanString(),
          }),
        }
      )
  );
};
