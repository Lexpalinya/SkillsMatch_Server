import { EMessage } from "./../utils/message";
import { UserService } from "../services/user.service";
import { generateToken, setAuthCookies } from "../utils/authHelpers";
import { HashedPassword, VerifyPassword } from "../utils/password";
import { ResFail, ResFail500, ResSucess } from "../utils/response";
import { generateRandomCode } from "../utils/generateCode";
import {
  CacheDataAdd,
  CacheDataDelete,
  CacheDataUpdate,
} from "../utils/cache.control";
import { TUpdateUserDTO } from "../types/user.type";

import { RemoveImage, UploadImage } from "../utils/upload";
import { TParams, TQuery, TSet } from "../types/utils/elysiaCustom.typs";
import { ValidateLengthBody } from "../utils/validate";
import { converStringToBoolean } from "../utils/converData";

export class UsersController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  async Registor({
    body,
    set,
    cookie: { token, tokenRef },
    jwt,
    jwt_refresh,
  }: {
    body: any;
    set: TSet;
    cookie: any;
    jwt: any;
    jwt_refresh: any;
  }) {
    try {
      const today = new Date().toISOString().split("T")[0];
      if (!body.username && body.role === "jobber") {
        body.username = "Jobber-" + generateRandomCode(6) + today;
      }
      if (!body.username && body.role !== "jobber") {
        return ResFail({
          set,
          message: `${EMessage.INPUT_REQUIRED} username`,
        });
      }
      const promise = [
        this.userService.findAlready("email", { email: body.email }),
        this.userService.findAlready("phoneNumber", {
          phoneNumber: body.phoneNumber,
        }),
        this.userService.findAlready("username", {
          username: body.username,
        }),
      ];
      const [userEmailExists, userPhoneNumberExists, usernameExists] =
        await Promise.all(promise);

      console.log("userEmail", userEmailExists);
      if (userEmailExists || userPhoneNumberExists || usernameExists) {
        return ResFail({
          set,
          message: `${EMessage.ERROR_USER_EXISTS} with ${
            userEmailExists
              ? "email"
              : userPhoneNumberExists
              ? "phoneNumber"
              : "username"
          }`,
        });
      }
      const password = await HashedPassword(body.password);
      const user = await this.userService.create({ ...body, password });
      const users = await this.userService.findMany();
      await CacheDataAdd("users", user, users);
      const result = await generateToken(jwt, jwt_refresh, {
        id: user.id,
        loginVersion: user.loginVersion,
        role: user.role,
      });
      setAuthCookies(token, tokenRef, result.accessToken, result.refreshToken);

      return ResSucess({
        set,
        statusCode: 201,
        data: {
          ...user,
          ...result,
        },
        message: EMessage.SUCCESS_REGISTRATION,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_REGISTRATION}`,
        error: { error },
      });
    }
  }
  async Login({
    body: { password, phoneNumber },
    set,
    cookie: { token, tokenRef },
    jwt,
    jwt_refresh,
  }: {
    body: { password: string; phoneNumber: string };
    set: TSet;
    cookie: any;
    jwt: any;
    jwt_refresh: any;
  }) {
    try {
      const user = await this.userService.findAlready("phoneNumber", {
        phoneNumber,
      });
      if (!user) {
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} user`,
        });
      }
      if (user.block) {
        return ResFail({ set, message: `${EMessage.YOUR_ACCOUNT_BLOCKED}` });
      }
      const matchPassword = await VerifyPassword(password, user.password);
      if (!matchPassword) {
        return ResFail({
          set,
          message: `${EMessage.ERROR_LOGIN} :password not match`,
        });
      }
      const update = await this.userService.update(user.id, {
        loginVersion: user.loginVersion + 1,
      });

      const result = await generateToken(jwt, jwt_refresh, {
        id: user.id,
        loginVersion: update.loginVersion,
        role: update.role,
      });
      setAuthCookies(token, tokenRef, result.accessToken, result.refreshToken);
      const [users] = await Promise.all([this.userService.findMany()]);
      await CacheDataUpdate("users", update, users);
      return ResSucess({
        set,
        data: {
          ...update,
          ...result,
        },
        message: EMessage.SUCCESS_LOGIN,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_LOGIN} user `,
        error: { error },
      });
    }
  }

  async RefreshToken({
    set,
    cookie: { token, tokenRef },
    jwt,
    jwt_refresh,
  }: {
    set: TSet;
    cookie: any;
    jwt: any;
    jwt_refresh: any;
  }) {
    try {
      if (!token.value) {
        return ResFail({
          set,
          statusCode: 401,
          message: `${EMessage.ERROR_TOKEN_MISSING}`,
        });
      }
      const decode = await jwt_refresh.verify(tokenRef.value);
      if (decode === false) {
        return ResFail({
          set,
          statusCode: 401,
          message: `${EMessage.ERROR_TOKEN_EXPIRED}`,
        });
      }

      const user = await this.userService.findOne(decode.id);
      if (!user) {
        return ResFail({
          set,
          statusCode: 401,
          message: `${EMessage.ERROR_NOT_AUTHORIZED} `,
        });
      }
      if (user.block) {
        return ResFail({ set, message: `${EMessage.YOUR_ACCOUNT_BLOCKED}` });
      }

      const update = await this.userService.update(user.id, {
        loginVersion: user.loginVersion + 1,
      });

      const result = await generateToken(jwt, jwt_refresh, {
        id: user.id,
        loginVersion: update.loginVersion,
        role: update.role,
      });
      setAuthCookies(token, tokenRef, result.accessToken, result.refreshToken);
      const [users] = await Promise.all([this.userService.findMany()]);
      await CacheDataUpdate("users", update, users);
      return ResSucess({
        set,
        message: EMessage.SUCCESS_TOKEN_REFRESH,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_TOKEN_REFRESH} user `,
        error: { error },
      });
    }
  }
  async Logout({
    set,
    cookie: { token, tokenRef },
  }: {
    set: TSet;
    cookie: any;
  }) {
    try {
      setAuthCookies(token, tokenRef, "", "");
      return ResSucess({
        set,
        message: EMessage.SUCCESS_LOGOUT,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_LOGOUT} user `,
        error: { error },
      });
    }
  }
  async SelectAll({ set }: { set: any }) {
    try {
      const result = await this.userService.findMany();

      return ResSucess({
        set,
        message: EMessage.SUCCESS_FETCH_ALL,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE} user `,
        error: { error },
      });
    }
  }
  async SelectOne({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      const resutl = await this.userService.findOne(id);
      if (!resutl) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} user with id`,
        });
      }

      return ResSucess({
        set,
        message: EMessage.SUCCESS_FETCH_ONE,
        data: resutl,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE} user `,
        error: { error },
      });
    }
  }

  async Delete({ set, query }: { set: TSet; query: TQuery }) {
    try {
      const _id = query?.id || set.user!.id;
      const resutl = await this.userService.findOne(_id);
      if (!resutl) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} user with id`,
        });
      }
      const [userDel, user] = await Promise.all([
        this.userService.delete(_id),
        this.userService.findMany(),
      ]);
      await CacheDataDelete("users", _id, user);

      return ResSucess({
        set,
        data: userDel,
        message: EMessage.SUCCESS_DELETE,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_DELETE} user `,
        error: { error },
      });
    }
  }

  async Update({ body, set, query }: { body: any; set: TSet; query: TQuery }) {
    try {
      if (ValidateLengthBody(body))
        return ResFail({
          set,
          message: `${EMessage.INPUT_REQUIRED} data for update user`,
        });

      const _id = query?.id || set.user!.id;
      const dataUpdate: TUpdateUserDTO = {
        ...body,
        visible: converStringToBoolean(body.visible),
        block: converStringToBoolean(body.block),
      };

      const promiseList = [this.userService.findOne(_id)];

      if (body.email)
        promiseList.push(
          this.userService.findAlready("email", { email: body.email })
        );
      if (body.phoneNumber)
        promiseList.push(
          this.userService.findAlready("phoneNumber", {
            phoneNumber: body.phoneNumber,
          })
        );
      if (body.username)
        promiseList.push(
          this.userService.findAlready("username", { username: body.username })
        );

      const results = await Promise.all(promiseList);

      const userExists = results.shift();
      if (!userExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} user with id`,
        });

      let userEmailExists, userPhoneNumberExists, userUsernameExists;
      if (body.email) userEmailExists = results.shift();
      if (body.phoneNumber) userPhoneNumberExists = results.shift();
      if (body.username) userUsernameExists = results.shift();

      if (
        (body.email && userEmailExists) ||
        (body.phoneNumber && userPhoneNumberExists) ||
        (body.username && userUsernameExists)
      ) {
        const conflictField = body.email
          ? "email"
          : body.phoneNumber
          ? "phoneNumber"
          : "username";

        return ResFail({
          set,
          statusCode: 409,
          message: `${EMessage.ERROR_USER_EXISTS} with ${conflictField}`,
        });
      }

      const [userUpdate, users] = await Promise.all([
        this.userService.update(_id, dataUpdate),
        this.userService.findMany(),
      ]);

      await CacheDataUpdate("users", userUpdate, users);

      return ResSucess({
        set,
        data: userUpdate,
        message: EMessage.SUCCESS_UPDATE,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} user`,
        error: { error },
      });
    }
  }

  async ForgotPassword({
    body: { phoneNumber, password },
    set,
  }: {
    body: {
      phoneNumber: string;
      password: string;
    };
    set: TSet;
  }) {
    try {
      const user = await this.userService.findAlready("phoneNumber", {
        phoneNumber,
      });
      if (!user)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} user with phoneNumber`,
        });

      const password_ = await HashedPassword(password);

      const [userUpdate, users] = await Promise.all([
        this.userService.update(user.id, { password: password_ }),
        this.userService.findMany(),
      ]);

      await CacheDataUpdate("users", userUpdate, users);

      return ResSucess({
        set,
        data: userUpdate,
        message: EMessage.SUCCESS_FORGOT_PASSWORD,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FORGOT_PASSWORD} user`,
        error: { error },
      });
    }
  }

  async ChangePassword({
    body: { newPassword, oldPassword },
    set,
    query,
  }: {
    body: {
      newPassword: string;
      oldPassword: string;
    };
    set: TSet;
    query: TQuery;
  }) {
    try {
      const _id = query?.id || set.user!.id;
      const user = await this.userService.findOne(_id);
      if (!user) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} user with id`,
        });
      }
      const matchPassword = await VerifyPassword(oldPassword, user.password);
      if (!matchPassword) {
        return ResFail({
          set,
          message: `${EMessage.ERROR_LOGIN} :password not match`,
        });
      }
      const password_ = await HashedPassword(newPassword);

      const [userUpdate, users] = await Promise.all([
        this.userService.update(user.id, { password: password_ }),
        this.userService.findMany(),
      ]);

      await CacheDataUpdate("users", userUpdate, users);

      return ResSucess({
        set,
        data: userUpdate,
        message: EMessage.SUCCESS_PASSWORD_CHANGE,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_PASSWORD_CHANGE} user`,
        error: { error },
      });
    }
  }

  async UpdateProfile({
    body: { img, url },
    set,
    query,
  }: {
    body: {
      img: File;
      url?: string;
    };
    set: TSet;
    query: TQuery;
  }) {
    try {
      const _id = query?.id || set.user!.id;
      console.log("img", img);
      console.log("_id", _id);
      const resutl = await this.userService.findOne(_id);
      if (!resutl) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} user with id`,
        });
      }

      if (url) {
        await RemoveImage(url);
      }
      const url_ = await UploadImage(img);
      const dataUpdate = {
        profile: url_,
      };
      const [userUpdate, users] = await Promise.all([
        this.userService.update(_id, dataUpdate),
        this.userService.findMany(),
      ]);
      await CacheDataUpdate("users", userUpdate, users);

      return ResSucess({
        set,
        data: userUpdate,
        message: EMessage.SUCCESS_UPDATE,
      });
    } catch (error: any) {
      if (error.message === "Failed to delete image") {
        return ResFail({
          set,
          message: error.message,
          error: error.message,
        });
      }
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} user profile`,
        error: { error },
      });
    }
  }
  async UpdateBlackground({
    body: { img, url },
    set,
    query,
  }: {
    body: {
      img: File;
      url?: string;
    };
    set: TSet;
    query: TQuery;
  }) {
    try {
      const _id = query?.id || set.user!.id;
      const resutl = await this.userService.findOne(_id);
      if (!resutl) {
        set.status = 404;
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} user with id`,
        });
      }

      if (url) {
        await RemoveImage(url);
      }
      const url_ = await UploadImage(img);
      const dataUpdate: TUpdateUserDTO = {
        blackground: url_,
      };
      const [userUpdate, users] = await Promise.all([
        this.userService.update(_id, dataUpdate),
        this.userService.findMany(),
      ]);
      await CacheDataUpdate("users", userUpdate, users);

      return ResSucess({
        set,
        data: userUpdate,
        message: EMessage.SUCCESS_UPDATE,
      });
    } catch (error: any) {
      if (error.message === "Failed to delete image") {
        return ResFail({
          set,
          message: error.message,
          error: error.message,
        });
      }
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} user blackground`,
        error: { error },
      });
    }
  }
}
