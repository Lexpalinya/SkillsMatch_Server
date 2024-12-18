
import Elysia, { t } from "elysia";
import { CompaniesController } from "../../controller/Companies/companies.controller";
import { auth } from "../../auth/auth";
import jwt from "@elysiajs/jwt";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../../config/api.config";

export const CompaniesRouter = (app: Elysia) => {
  const companiescontroller = new CompaniesController();

  return app.group("/companies", (app) =>
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
      .get("/", ({ set }) => companiescontroller.SelectAll({ set }), {
        beforeHandle: [auth],
      })
      .get(
        "/:id",
        ({ set, params }) => companiescontroller.SelectOne({ set, params }),
        {
          beforeHandle: [auth],
          params: t.Object({
            id: t.String(),
          }),
        }
      )
      .post(
        "/",
        ({ body, set, query }) =>
          companiescontroller.Create({ body, set, query }),
        {
          beforeHandle: [auth],
          body: t.Object({
            nameLao: t.String(),
            nameEng: t.String(),
            bmId: t.String(),
            headName: t.Optional(t.String()),
            toId: t.String(),
            street: t.String(),
            intarnalOrganization: t.String(),
            cProvice: t.String(),
            cDistrict: t.String(),
            cVillage: t.String(),
            docImage: t.Files(),
          }),
          query: t.Optional(
            t.Object({
              userId: t.String(),
            })
          ),
        }
      )
      .put(
        "/:id",
        ({ body, set, params }) =>
          companiescontroller.Update({ body, set, params }),
        {
          beforeHandle: [auth],
          body: t.Object({
            isVerify: t.Optional(t.BooleanString()),
            nameLao: t.Optional(t.String()),
            nameEng: t.Optional(t.String()),
            bmId: t.Optional(t.String()),
            headName: t.Optional(t.String()),
            toId: t.Optional(t.String()),
            street: t.Optional(t.String()),
            intarnalOrganization: t.Optional(t.String()),
            cProvice: t.Optional(t.String()),
            cDistrict: t.Optional(t.String()),
            cVillage: t.Optional(t.String()),
            reason: t.Optional(t.String()),
          }),
        }
      )
      .put(
        "/docImage/:id",
        ({ body, set, params }) =>
          companiescontroller.UpdateDocImage({ body, set, params }),
        {
          beforeHandle: [auth],
          body: t.Object({
            docImage: t.Optional(t.File()),
            oldUrl: t.Optional(t.String()),
          }),
        }
      )
  );
};
