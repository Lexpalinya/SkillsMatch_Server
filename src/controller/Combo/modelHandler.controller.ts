import { UserService } from "./../../services/user.service";
import { converStringToBoolean } from "../../utils/converData";
import { EMessage } from "../../utils/message";
import { ResFail, ResFail500, ResSucess } from "../../utils/response";
import {
  CacheDataAdd,
  CacheDataDelete,
  CacheDataUpdate,
} from "../../utils/cache.control";
import { ServiceInterface } from "../../types/modelHandler.type";
import { PrismaClient } from "@prisma/client";
import { TParams, TSet } from "../../types/utils/elysiaCustom.typs";

export class ModeldelHandlerController<T extends ServiceInterface> {
  private Service: T;
  private userService: UserService;
  private model: string;
  constructor(service: T, model: keyof PrismaClient) {
    this.Service = service;
    this.userService = new UserService();
    this.model = String(model);
  }
  async Create({
    body: { name, visible },
    set,
  }: {
    body: { name: string; visible?: boolean | string };
    set: TSet;
  }) {
    try {
      const userId = set.user!.id;

      const [nameExists, userExists] = await Promise.all([
        this.Service.FindByName({ name }),
        this.userService.findOne(userId),
      ]);

      if (nameExists) {
        return ResFail({
          set,
          message: EMessage.THIS_NAME_ALREADY,
          error: "name",
        });
      }
      if (!userExists) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} user`,
          error: "userId",
        });
      }
      visible = converStringToBoolean(visible);
      const [allData, newData] = await Promise.all([
        this.Service.FindMany(),
        this.Service.Create({ name, userId, visible }),
      ]);
      await CacheDataAdd(this.model, newData, allData);

      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_INSERT} ${this.model}`,
        data: newData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_INSERT} ${this.model}`,
        error: { error },
      });
    }
  }
  async Update({
    body: { name, userId, visible },
    set,
    params: { id },
  }: {
    body: { name?: string; userId?: string; visible?: boolean | string };
    set: TSet;
    params: TParams;
  }) {
    try {
      let promiseList: any = [this.Service.FindOne(id)];
      if (userId) promiseList.push(this.userService.findOne(userId));
      if (name) promiseList.push(this.Service.FindByName({ name }));
      const result = await Promise.all(promiseList);
      let exists = result.shift(),
        userExists,
        nameExists;
      if (userId) userExists = result.shift();
      if (name) nameExists = result.shift();

      if (!exists || (userId && userExists)) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !exists ? this.model : "user"
          }`,
          error: !exists ? "id" : "userId",
        });
      }
      if (nameExists) {
        return ResFail({
          set,
          message: EMessage.THIS_NAME_ALREADY,
          error: "name",
        });
      }
      visible = converStringToBoolean(visible);

      const [allData, dataUpdate] = await Promise.all([
        this.Service.FindMany(),
        this.Service.Update({ id }, { visible, name, userId }),
      ]);
      await CacheDataUpdate(this.model, dataUpdate, allData);

      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_UPDATE} ${this.model}`,
        data: dataUpdate,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} ${this.model}`,
        error: { error },
      });
    }
  }

  async Delete({ params: { id }, set }: { params: TParams; set: TSet }) {
    try {
      const exists = await this.Service.FindOne(id);
      if (!exists) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.model}`,
          error: "id",
        });
      }

      const [allData, deleteData] = await Promise.all([
        this.Service.FindMany(),
        this.Service.Delete({ id }),
      ]);
      await CacheDataDelete(this.model, deleteData.id, allData);

      return ResSucess({
        set,

        message: `${EMessage.SUCCESS_DELETE} ${this.model}`,
        data: deleteData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_DELETE} ${this.model}`,
        error: { error },
      });
    }
  }

  async SelectAll({ set }: { set: TSet }) {
    try {
      const result = await this.Service.FindMany();

      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ALL} ${this.model}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} ${this.model}`,
        error: { error },
      });
    }
  }

  async SelectOne({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      const result = await this.Service.FindOne(id);
      if (!result) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.model}`,
          error: "id",
        });
      }

      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} ${this.model}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE} ${this.model}`,
        error: { error },
      });
    }
  }
  async SelectByVisible({
    set,
    query: { visible },
  }: {
    set: TSet;
    query: { visible: boolean | string };
  }) {
    try {
      let _visible = converStringToBoolean(visible);
      const result = await this.Service.SelectVisible({ visible: _visible });
      if (!result) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.model}`,
        });
      }

      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ALL} visible ${this.model}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} visible ${this.model}`,
        error: { error },
      });
    }
  }
}
