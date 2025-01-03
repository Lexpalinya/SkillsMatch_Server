import { PrismaClient } from "@prisma/client";
import { PostsService } from "../../../services/companies/posts/posts.service";
import {
  TParams,
  TParams_,
  TSet,
} from "../../../types/utils/elysiaCustom.typs";
import { EMessage } from "../../../utils/message";
import { ResFail, ResFail500, ResSucess } from "../../../utils/response";
import { CacheDataUpdate } from "../../../utils/cache.control";
import { converStringToFloat } from "../../../utils/converData";
import { PostsLanguagesService } from "../../../services/companies/posts/language.service";
import { LanguagesService } from "../../../services/Combo/languages.service";
import { TPostLanguageCreateBodyDTU } from "../../../types/Companies/posts/language.type";

export class PostLanguageController {
  private key: string;
  private keyPL: string;
  private modelPL: keyof PrismaClient;
  private model: keyof PrismaClient;
  private pService: PostsService;
  private plService: PostsLanguagesService;
  private lService: LanguagesService;
  constructor() {
    this.model = "posts";
    this.modelPL = "postLanguage";
    this.keyPL = String(this.modelPL);
    this.key = String(this.model);
    this.pService = new PostsService();
    this.lService = new LanguagesService();
    this.plService = new PostsLanguagesService();
  }
  async Add({
    body,
    set,
    params: { id },
  }: {
    body: TPostLanguageCreateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      const [postsExists, lExists, plExists] = await Promise.all([
        this.pService.FindOne(id),
        this.lService.FindOne(body.lId),
        this.plService.FindAlready({ pId: id, lId: body.lId }),
      ]);
      if (plExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,lId",
        });

      if (!postsExists || !lExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? "post" : "language"
          }`,
          error: `${!postsExists ? "pId" : "lId"}`,
        });

      const result = await this.plService.Create({ lId: body.lId, pId: id });
      const [allData, updateData] = await Promise.all([
        this.pService.FindMany(),
        this.pService.FindUnique(id),
      ]);
      if (updateData) CacheDataUpdate(this.key, updateData, allData);
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_UPDATE_ADD} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE_ADD}  ${this.key}`,
        error: { error },
      });
    }
  }
  async Update({
    body,
    set,
    params: { id, _id },
  }: {
    body: TPostLanguageCreateBodyDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const [postsExists, lExists, plExists] = await Promise.all([
        this.pService.FindOne(id),
        this.lService.FindOne(body.lId),
        this.plService.FindAlready({ pId: id, lId: body.lId }),
      ]);
      if (plExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,lId",
        });

      if (!postsExists || !lExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? "post" : "language"
          }`,
          error: `${!postsExists ? "pId" : "lId"}`,
        });

      const resutl = await this.plService.Update(_Id, body);
      const [allData, updateData] = await Promise.all([
        this.pService.FindMany(),
        this.pService.FindUnique(id),
      ]);
      if (updateData) CacheDataUpdate(this.key, updateData, allData);
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_UPDATE_UPDATE} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE_UPDATE} ${this.key}`,
        error: { error },
      });
    }
  }
  async Delete({ set, params: { id, _id } }: { set: TSet; params: TParams_ }) {
    try {
      const _Id = converStringToFloat(_id);
      const plExists = await this.plService.FindOne(_Id);
      if (!plExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key}`,
        });
      const result = await this.plService.Delete(_Id);
      const [allData, updateData] = await Promise.all([
        this.pService.FindMany(),
        this.pService.FindUnique(id),
      ]);

      if (updateData) CacheDataUpdate(this.key, updateData, allData);
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_UPDATE_DELETE} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE_DELETE} ${this.key}`,
        error: { error },
      });
    }
  }
}
