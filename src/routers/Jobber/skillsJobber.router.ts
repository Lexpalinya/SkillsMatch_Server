import Elysia, { t } from "elysia";

import { SkillsJobbersController } from "../../controller/Jobber/skillsJobber.controller";
import { ECurrency } from "@prisma/client";
import jwt from "@elysiajs/jwt";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../../config/api.config";
import { auth } from "../../auth/auth";
import { SkillsJobberLanguageController } from "../../controller/Jobber/skillsJobberLanguage.controller";
import { SkillsJobberSkillsController } from "../../controller/Jobber/skillsJobberSkills.controller";
import { SkillsJobberJobPositionsController } from "../../controller/Jobber/skillsjobberJobPosition.controller";

export const SkillsJobberRouter = (app: Elysia) => {
  const SJController = new SkillsJobbersController();

  const SJLanguageController = new SkillsJobberLanguageController();
  const SJSkillController = new SkillsJobberSkillsController();
  const SJJobPositionsController = new SkillsJobberJobPositionsController();
  return app.group("/skillsJobber", (app) =>
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
        ({ body, set, query }) => SJController.Create({ body, set, query }),
        {
          beforeHandle: [auth],
          body: t.Object({
            elId: t.String(),
            eiId: t.String(),
            fId: t.String(),
            scId: t.String(),
            gpa: t.String() || t.Number(),
            drivingCardType: t.Optional(t.Union([t.String(), t.Null()])), // Allow null
            more: t.String(),
            startSalary: t.Optional(t.String() || t.Number()),
            currency: t.Enum(ECurrency),
            workDay: t.String() || t.Array(t.String()),
            checkInTime: t.Optional(t.Date()),
            checkOutTime: t.Optional(t.Date()),
            languages: t.String() || t.Array(t.String()),
            jobPositions: t.String() || t.Array(t.String()),
            skills: t.String() || t.Array(t.String()),
          }),
        }
      )
      .put(
        "/:id",
        ({ body, set, params }) =>
          SJController.Update({
            body,
            set,
            params,
          }),
        {
          beforeHandle: [auth],
          body: t.Object({
            elId: t.Optional(t.String()),
            eiId: t.Optional(t.String()),
            fId: t.Optional(t.String()),
            scId: t.Optional(t.String()),
            gpa: t.Optional(t.String() || t.Number()),
            drivingCardType: t.Optional(t.String()), // Allow null
            more: t.Optional(t.String()),
            startSalary: t.Optional(t.String() || t.Number()),
            currency: t.Optional(t.Enum(ECurrency)),
            workDay: t.Optional(t.String() || t.Array(t.String())),
            checkInTime: t.Optional(t.Date()),
            checkOutTime: t.Optional(t.Date()),
          }),
        }
      )
      .get("/", ({ set }) => SJController.SelectAll({ set }), {
        beforeHandle: [auth],
      })
      .get(
        "/:id",
        ({ set, params }) => SJController.SelectOne({ set, params }),
        {
          beforeHandle: [auth],
        }
      )

      //**
      //   SkillJobberSkill router
      //  */
      .group("/skills", (app) => {
        return app
          .put(
            "/add/:id",
            ({ body, set, params }) =>
              SJSkillController.Create({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                sId: t.String(),
              }),
            }
          )
          .put(
            "/update/:id/:_id",
            ({ body, set, params }) =>
              SJSkillController.Update({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                sId: t.String(),
              }),
            }
          )
          .put(
            "/delete/:id/:_id",
            ({ set, params }) => SJSkillController.Delete({ set, params }),
            {
              beforeHandle: [auth],
            }
          );
      })

      //**
      //   SkillJobberJobPositions router
      //  */
      .group("/jobPositions", (app) => {
        return app
          .put(
            "/add/:id",
            ({ body, set, params }) =>
              SJJobPositionsController.Create({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                jpId: t.String(),
              }),
            }
          )
          .put(
            "/update/:id/:_id",
            ({ body, set, params }) =>
              SJJobPositionsController.Update({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                jpId: t.String(),
          
              }),
            }
          )
          .put(
            "/delete/:id/:_id",
            ({ set, params }) =>
              SJJobPositionsController.Delete({ set, params }),
            {
              beforeHandle: [auth],
            }
          );
      })
      .group("/languages", (app) => {
        return app
          .put(
            "/add/:id",
            ({ body, set, params }) =>
              SJLanguageController.Create({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                lId: t.String(),
              }),
            }
          )
          .put(
            "/update/:id/:_id",
            ({ body, set, params }) =>
              SJLanguageController.Update({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                lId: t.String(),
              }),
            }
          )
          .put(
            "/delete/:id/:_id",
            ({ set, params }) => SJLanguageController.Delete({ set, params }),
            {
              beforeHandle: [auth],
            }
          );
      })
  );
};
