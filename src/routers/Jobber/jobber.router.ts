import { EGender } from "@prisma/client";
import { JobberController } from "../../controller/Jobber/jobber.controller";
import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../../config/api.config";
import { auth } from "../../auth/auth";

export const JobberRouter = (app: Elysia) => {
  const jobberController = new JobberController();

  return app.group("/jobber", (app) =>
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
      .get("/", ({ set }) => jobberController.SelectAll({ set }), {
        beforeHandle: [auth],
      })
      .get(
        "/:id",
        ({ set, params }) => jobberController.SelectOne({ set, params }),
        {
          beforeHandle: [auth],
        }
      )
      .post(
        "/",
        ({ body, set, query }) => jobberController.Create({ body, set, query }),
        {
          beforeHandle: [auth],

          body: t.Object({
            gender: t.Enum(EGender),
            firstName: t.String(),
            lastName: t.String(),
            birthday: t.Date(),
            nationality: t.String(),
            ethnicity: t.String(),
            religion: t.String(),
            bProvice: t.String(),
            bDistrict: t.String(),
            bVillage: t.String(),
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
          jobberController.Update({ body, set, params }),
        {
          beforeHandle: [auth],
          body: t.Object({
            isVerify: t.Optional(t.BooleanString()),
            gender: t.Optional(t.Enum(EGender)),
            firstName: t.Optional(t.String()),
            lastName: t.Optional(t.String()),
            birthday: t.Optional(t.Date()),
            nationality: t.Optional(t.String()),
            ethnicity: t.Optional(t.String()),
            religion: t.Optional(t.String()),
            bProvice: t.Optional(t.String()),
            bDistrict: t.Optional(t.String()),
            bVillage: t.Optional(t.String()),
            cProvice: t.Optional(t.String()),
            cDistrict: t.Optional(t.String()),
            cVillage: t.Optional(t.String()),
          }),
        }
      )
      .put(
        "/docImage/:id",
        ({ body, set, params }) =>
          jobberController.UpdateDocImage({ body, set, params }),
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
