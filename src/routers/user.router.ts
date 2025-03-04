import { UsersController } from "./../controller/user.controller";
import Elysia, { t } from "elysia";
import { EUserRole } from "@prisma/client";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
} from "../config/api.config";
import jwt from "@elysiajs/jwt";
import { admin, auth } from "../auth/auth";
import { EuserRole } from "../types/utils/enum.type";

export const UserRouter = (app: Elysia) => {
  const UsersControllers = new UsersController();
  return app.group("/users", (app) =>
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
        "/register",
        async ({ body, jwt, jwt_refresh, set, cookie }) =>
          UsersControllers.Registor({ body, jwt, jwt_refresh, set, cookie }),
        {
          body: t.Object({
            email: t.String({ format: "email" }),
            phoneNumber: t.String(),
            role: t.Enum(EUserRole),
            password: t.String(),
            username: t.Optional(t.String()),
          }),
        }
      )
      .post(
        "/refreshToken",
        async ({ jwt, jwt_refresh, set, cookie }) =>
          UsersControllers.RefreshToken({ jwt, jwt_refresh, set, cookie }),
        {}
      )
      .post(
        "/logout",
        async ({ set, cookie }) => UsersControllers.Logout({ set, cookie }),
        {
          beforeHandle: [auth],
        }
      )
      .post(
        "/login",
        async ({ body, jwt, jwt_refresh, set, cookie }) =>
          UsersControllers.Login({ body, jwt, jwt_refresh, set, cookie }),
        {
          body: t.Object({
            phoneNumber: t.String(),
            password: t.String(),
          }),
        }
      )
      .get("/", ({ set }) => UsersControllers.SelectAll({ set }), {
        beforeHandle: [auth, admin],
      })
      .get(
        "/:id",
        ({ set, params }) => UsersControllers.SelectOne({ set, params }),
        {
          beforeHandle: [auth],
        }
      )
      .delete(
        "/",
        ({ set, query }) => UsersControllers.Delete({ set, query }),
        {
          beforeHandle: [auth, admin],
          query: t.Optional(
            t.Object({
              id: t.String(),
            })
          ),
        }
      )

      .put(
        "/",
        ({ body, set, query }) => UsersControllers.Update({ body, set, query }),
        {
          beforeHandle: auth,
          query: t.Optional(
            t.Object({
              id: t.String(),
            })
          ),
          body: t.Optional(
            t.Object({
              email: t.Optional(t.String({ format: "email" })),
              phoneNumber: t.Optional(t.String()),
              username: t.Optional(t.String()),
              password: t.Optional(t.String()),
              visible: t.Optional(t.BooleanString()),
              block: t.Optional(t.BooleanString()),
              role: t.Optional(t.Enum(EuserRole)),
            })
          ),
        }
      )

      .put(
        "/profile",
        ({ body, set, query }) =>
          UsersControllers.UpdateProfile({ body, set, query }),
        {
          beforeHandle: auth,
          body: t.Object({
            img: t.File(),
            url: t.Optional(t.String()),
          }),
          query: t.Optional(
            t.Object({
              id: t.String(),
            })
          ),
        }
      )
      .put(
        "/blackground",
        ({ body, set, query }) =>
          UsersControllers.UpdateBlackground({ body, set, query }),
        {
          beforeHandle: auth,
          body: t.Object({
            img: t.File(),
            url: t.Optional(t.String()),
          }),
          query: t.Optional(
            t.Object({
              id: t.String(),
            })
          ),
        }
      )

      .put(
        "/forgotPassword",
        ({ body, set }) => UsersControllers.ForgotPassword({ body, set }),
        {
          body: t.Object({
            phoneNumber: t.String(),
            password: t.String(),
          }),
        }
      )
      .put(
        "/changePassword",
        ({ body, set, query }) =>
          UsersControllers.ChangePassword({ body, set, query }),
        {
          beforeHandle: auth,
          body: t.Object({
            newPassword: t.String(),
            oldPassword: t.String(),
          }),
        }
      )
  );
};
