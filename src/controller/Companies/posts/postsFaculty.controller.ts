import { PrismaClient } from "@prisma/client";
import { PostsService } from "../../../services/companies/posts/posts.service";
import { FacultyService } from "../../../services/Combo/facultys.service";
import { PostsFacultysService } from "../../../services/companies/posts/faculty.service";
import {
  TParams,
  TParams_,
  TSet,
} from "../../../types/utils/elysiaCustom.typs";
import { EMessage } from "../../../utils/message";
import { ResFail, ResFail500, ResSucess } from "../../../utils/response";
import {
  TPostFacultysCreateBodyDTU,
  TPostFacultysUpdateDTU,
} from "../../../types/Companies/posts/faculty.types";
import { CacheDataUpdate } from "../../../utils/cache.control";
import { converStringToFloat } from "../../../utils/converData";

export class PostFacultysController {
  private key: string;
  private keyPF: string;
  private modelPF: keyof PrismaClient;
  private model: keyof PrismaClient;
  private pService: PostsService;
  private pFService: PostsFacultysService;
  private fService: FacultyService;
  constructor() {
    this.model = "posts";
    this.modelPF = "postFacultys";
    this.keyPF = String(this.modelPF);
    this.key = String(this.model);
    this.pService = new PostsService();
    this.fService = new FacultyService();
    this.pFService = new PostsFacultysService();
  }
  async Add({
    body,
    set,
    params: { id },
  }: {
    body: TPostFacultysCreateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      const [postsExists, fExists, pfExists] = await Promise.all([
        this.pService.FindOne(id),
        this.fService.FindOne(body.fId),
        this.pFService.FindAlready({ pId: id, fId: body.fId }),
      ]);
      if (pfExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,fId",
        });

      if (!postsExists || !fExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? "post" : "faculty"
          }`,
          error: `${!postsExists ? "pId" : "fId"}`,
        });

      const result = await this.pFService.Create({ fId: body.fId, pId: id });
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
    body: TPostFacultysUpdateDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const [postsExists, fExists, pfExists] = await Promise.all([
        this.pService.FindOne(id),
        this.fService.FindOne(body.fId),
        this.pFService.FindAlready({ pId: id, fId: body.fId }),
      ]);
      if (pfExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,fId",
        });

      if (!postsExists || !fExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? "post" : "faculty"
          }`,
          error: `${!postsExists ? "pId" : "fId"}`,
        });

      const resutl = await this.pFService.Update(_Id, body);
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
      const pfExists = await this.pFService.FindOne(_Id);
      if (!pfExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key}`,
        });
      const result = await this.pFService.Delete(_Id);
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
