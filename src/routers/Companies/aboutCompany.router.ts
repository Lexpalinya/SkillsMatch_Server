import { AboutCompanyController } from "./../../controller/Companies/aboutCompany.controller";
import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../../config/api.config";
import { admin, auth } from "../../auth/auth";

export const AboutCompanyRouter = (app: Elysia) => {
  const aboutCompanyController = new AboutCompanyController();
  return app.group("/aboutCompany", (app) =>
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
      .get(
        "/",
        ({ set, cookie }) => aboutCompanyController.SelectAll({ set }),
        {
          beforeHandle: [auth, admin],
        }
      )
      .get(
        "/:id",
        ({ set, params }) => aboutCompanyController.SelectOne({ set, params }),
        {
          beforeHandle: [auth],
        }
      )
      .get(
        "/ByCompany/:id",
        ({ set, params }) =>
          aboutCompanyController.SelectByCompanyId({ set, params }),
        {
          beforeHandle: [auth],
        }
      )
      .post(
        "/",
        ({ body, set }) => aboutCompanyController.Create({ body, set }),
        {
          beforeHandle: [auth],
          body: t.Object({
            cId: t.String(),
            title: t.String(),
            detail: t.String(),
            images: t.Files(),
          }),
        }
      )
      .put(
        "/:id",
        ({ body, set, params }) =>
          aboutCompanyController.Update({ body, set, params }),
        {
          beforeHandle: [auth],
          body: t.Object({
            visible: t.Optional(t.BooleanString()),
            cId: t.Optional(t.String()),
            title: t.Optional(t.String()),
            detail: t.Optional(t.String()),
          }),
        }
      )
      .put(
        "/image/:id",
        ({ body, set, params }) =>
          aboutCompanyController.UpdateDocImage({ body, set, params }),
        {
          beforeHandle: [auth],
          body: t.Object({
            image: t.Optional(t.File()),
            oldUrl: t.Optional(t.String()),
          }),
        }
      )
      .delete(
        "/:id",
        ({ set, params }) => aboutCompanyController.Delete({ set, params }),
        { beforeHandle: [auth] }
      )
  );
};
