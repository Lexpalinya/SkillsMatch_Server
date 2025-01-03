import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../../../config/api.config";
import { PostsController } from "../../../controller/Companies/posts/posts.controller";
import { auth } from "../../../auth/auth";
import { ECurrency } from "@prisma/client";
import { PostLanguageController } from "../../../controller/Companies/posts/postsLanguage.controller";
import { PostsStudyCourseController } from "../../../controller/Companies/posts/postsStudyCourse.controller";
import { PostsEductionalInstitutionsController } from "../../../controller/Companies/posts/postsEducationalInstitutions.controller";
import { PostFacultysController } from "../../../controller/Companies/posts/postsFaculty.controller";
import { PostsJobPositionsDetailsController } from "../../../controller/Companies/posts/postsJobPositionDetails.controller";
import { PostsJobPositionsDetailsSkillsController } from "../../../controller/Companies/posts/postsJobPositionDetailsSkills.controller";

export const PostsRouter = (app: Elysia) => {
  const postsController = new PostsController();
  const postsLanguagesController = new PostLanguageController();
  const postsStudyCourseController = new PostsStudyCourseController();
  const postsEducationalInstitutionsController =
    new PostsEductionalInstitutionsController();

  const postsFacultysController = new PostFacultysController();
  const postsJobPositionsDetailsCotroller =
    new PostsJobPositionsDetailsController();
  const postsJobPositionsDetailsSkillsCotroller =
    new PostsJobPositionsDetailsSkillsController();
  return app.group("/posts", (app) =>
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
      .get("/", ({ set }) => postsController.SelectAll({ set }), {
        beforeHandle: [auth],
      })
      .get(
        "/:id",
        ({ set, params }) => postsController.SelectOne({ set, params }),
        {
          beforeHandle: [auth],
        }
      )
      .delete(
        "/:id",
        ({ set, params }) => postsController.Delete({ set, params }),
        {
          beforeHandle: [auth],
        }
      )
      .put(
        "/:id",
        ({ body, set, params }) =>
          postsController.Update({ body, set, params }),
        {
          beforeHandle: [auth],
          body: t.Object({
            visible: t.Optional(t.BooleanString()),
            cId: t.Optional(t.String()),
            title: t.Optional(t.String()),
            endDate: t.Optional(t.Date()),
            startSalary: t.Optional(t.Number() || t.String()),
            endSalary: t.Optional(t.Number() || t.String()),
            workDay: t.Optional(t.String() || t.ArrayString()),
            checkInTime: t.Optional(t.Date()),
            checkOutTime: t.Optional(t.Date()),
            gpa: t.Optional(t.Number() || t.String()),
            welfare: t.Optional(t.String()),
            more: t.Optional(t.String()),
            currency: t.Optional(t.Enum(ECurrency)),
          }),
        }
      )
      .put(
        "/image/:id",
        ({ body, set, params }) =>
          postsController.UpdateImage({ body, set, params }),
        {
          beforeHandle: [auth],
          body: t.Object({
            image: t.Optional(t.File()),
            oldUrl: t.Optional(t.String()),
          }),
        }
      )
      .post("/", ({ body, set }) => postsController.Create({ body, set }), {
        beforeHandle: [auth],
        body: t.Object({
          visible: t.BooleanString(),
          cId: t.String(),
          title: t.String(),
          endDate: t.Optional(t.Date()),
          startSalary: t.Optional(t.Number() || t.String()),
          endSalary: t.Optional(t.Number() || t.String()),
          workDay: t.Array(t.String()),
          checkInTime: t.Optional(t.Date()),
          checkOutTime: t.Optional(t.Date()),
          gpa: t.Number() || t.String(),
          welfare: t.String(),
          more: t.String(),
          currency: t.Enum(ECurrency),
          languages: t.String() || t.ArrayString(),
          studyCourses: t.String() || t.ArrayString(),
          educationalInstitutions: t.String() || t.ArrayString(),
          facultys: t.String() || t.ArrayString(),
          jobpositionsDetails:
            t.String() ||
            t.Object({
              jpId: t.String(),
              amount: t.Number(),
              detail: t.String(),
              sId: t.Optional(t.ArrayString()),
            }),
          images: t.Files(),
        }),
      })

      .group("/languages", (app) =>
        app
          .post(
            "/:id",
            ({ body, set, params }) =>
              postsLanguagesController.Add({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                lId: t.String(),
              }),
            }
          )
          .put(
            "/:id/:_id",
            ({ body, set, params }) =>
              postsLanguagesController.Update({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                lId: t.String(),
              }),
            }
          )
          .delete("/:id/:_id", ({ set, params }) =>
            postsLanguagesController.Delete({ set, params })
          )
      )
      .group("/studyCourses", (app) =>
        app
          .post(
            "/:id",
            ({ body, set, params }) =>
              postsStudyCourseController.Add({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                scId: t.String(),
              }),
            }
          )
          .put(
            "/:id/:_id",
            ({ body, set, params }) =>
              postsStudyCourseController.Update({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                scId: t.String(),
              }),
            }
          )
          .delete("/:id/:_id", ({ set, params }) =>
            postsStudyCourseController.Delete({ set, params })
          )
      )
      .group("/eductionalInstitutions", (app) =>
        app
          .post(
            "/:id",
            ({ body, set, params }) =>
              postsEducationalInstitutionsController.Add({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                eiId: t.String(),
              }),
            }
          )
          .put(
            "/:id/:_id",
            ({ body, set, params }) =>
              postsEducationalInstitutionsController.Update({
                body,
                set,
                params,
              }),
            {
              beforeHandle: [auth],
              body: t.Object({
                eiId: t.String(),
              }),
            }
          )
          .delete("/:id/:_id", ({ set, params }) =>
            postsEducationalInstitutionsController.Delete({ set, params })
          )
      )
      .group("/facultys", (app) =>
        app
          .post(
            "/:id",
            ({ body, set, params }) =>
              postsFacultysController.Add({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                fId: t.String(),
              }),
            }
          )
          .put(
            "/:id/:_id",
            ({ body, set, params }) =>
              postsFacultysController.Update({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                fId: t.String(),
              }),
            }
          )
          .delete("/:id/:_id", ({ set, params }) =>
            postsFacultysController.Delete({ set, params })
          )
      )

      .group("/jobPosition", (app) =>
        app
          .post(
            "/:id",
            ({ body, set, params }) =>
              postsJobPositionsDetailsCotroller.Add({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                jpId: t.String(),
                amount: t.Number() || t.String(),
                detail: t.String(),
                sId: t.Optional(t.String() || t.ArrayString()),
              }),
            }
          )
          .put(
            "/:id/:_id",
            ({ body, set, params }) =>
              postsJobPositionsDetailsCotroller.Update({ body, set, params }),
            {
              beforeHandle: [auth],
              body: t.Object({
                jpId: t.Optional(t.String()),
                amount: t.Optional(t.Number() || t.String()),
                detail: t.Optional(t.String()),
              }),
            }
          )
          .delete(
            "/:id/:_id",
            ({ set, params }) =>
              postsJobPositionsDetailsCotroller.Delete({ set, params }),
            { beforeHandle: [auth] }
          )
          .group("/jobPositionSkills", (app) =>
            app
              .post(
                "/:id/:_id",
                ({ body, set, params }) =>
                  postsJobPositionsDetailsSkillsCotroller.Add({
                    body,
                    set,
                    params,
                  }),
                {
                  beforeHandle: [auth],
                  body: t.Object({
                    sId: t.String(),
                  }),
                }
              )
              .put(
                "/:id/:_id/:_ids",
                ({ body, set, params }) =>
                  postsJobPositionsDetailsSkillsCotroller.Update({
                    body,
                    set,
                    params,
                  }),
                {
                  beforeHandle: [auth],
                  body: t.Object({
                    sId: t.String(),
                  }),
                }
              )
              .delete(
                "/:id/:_id/:_ids",
                ({ set, params }) =>
                  postsJobPositionsDetailsSkillsCotroller.Delete({
                    set,
                    params,
                  }),
                { beforeHandle: [auth] }
              )
          )
      )
  );
};
