import { PrismaClient } from "@prisma/client";
import { PostsService } from "../../../services/companies/posts/posts.service";
import { StudyCourseService } from "../../../services/Combo/studyCourse.service";
import { PostsStudyCourseService } from "../../../services/companies/posts/studyCourse.service";
import { TPostStudyCourseCreateBodyDTU } from "../../../types/Companies/posts/studyCourse.type";
import {
  TParams,
  TParams_,
  TSet,
} from "../../../types/utils/elysiaCustom.typs";
import { ResFail, ResFail500, ResSucess } from "../../../utils/response";
import { EMessage } from "../../../utils/message";
import { CacheDataUpdate } from "../../../utils/cache.control";
import { converStringToFloat } from "../../../utils/converData";

export class PostsStudyCourseController {
  private key: string;
  private keyPF: string;
  private modelPF: keyof PrismaClient;
  private model: keyof PrismaClient;
  private pService: PostsService;
  private sService: StudyCourseService;
  private psService: PostsStudyCourseService;
  constructor() {
    this.model = "posts";
    this.modelPF = "postStudyCourse";
    this.keyPF = String(this.modelPF);
    this.key = String(this.model);
    this.pService = new PostsService();
    this.sService = new StudyCourseService();
    this.psService = new PostsStudyCourseService();
  }
  async Add({
    body,
    set,
    params: { id },
  }: {
    body: TPostStudyCourseCreateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      const [postsExists, scExists, pscExists] = await Promise.all([
        this.pService.FindOne(id),
        this.sService.FindOne(body.scId),
        this.psService.FindAlready({ pId: id, scId: body.scId }),
      ]);
      if (pscExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,scId",
        });

      if (!postsExists || !scExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? "post" : "studyCourse"
          }`,
          error: `${!postsExists ? "pId" : "scId"}`,
        });

      const result = await this.psService.Create({ scId: body.scId, pId: id });
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
    body: TPostStudyCourseCreateBodyDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const [postsExists, scExists, pscExists] = await Promise.all([
        this.pService.FindOne(id),
        this.sService.FindOne(body.scId),
        this.psService.FindAlready({ pId: id, scId: body.scId }),
      ]);
      if (pscExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,scId",
        });

      if (!postsExists || !scExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? "post" : "studyCourse"
          }`,
          error: `${!postsExists ? "pId" : "scId"}`,
        });

      const resutl = await this.psService.Update(_Id, body);
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
      const psExists = await this.psService.FindOne(_Id);
      if (!psExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key}`,
        });
      const result = await this.psService.Delete(_Id);
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
