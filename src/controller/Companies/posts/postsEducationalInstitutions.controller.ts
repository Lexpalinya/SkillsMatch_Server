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
import { PostsEductionalInstitutionsService } from "../../../services/companies/posts/educationalInstitutions.service";
import { EducationLevelService } from "../../../services/Combo/eductionLevel.service";
import { TPostEducationalInstitutionsCreateBodyDTU } from "../../../types/Companies/posts/educationalInstitutions.type";

export class PostFacultysController {
  private key: string;
  private keyPF: string;
  private modelPF: keyof PrismaClient;
  private model: keyof PrismaClient;
  private pService: PostsService;
  private peiService: PostsEductionalInstitutionsService;
  private eiService: EducationLevelService;
  constructor() {
    this.model = "posts";
    this.modelPF = "postEducationalInstitutions";
    this.keyPF = String(this.modelPF);
    this.key = String(this.model);
    this.pService = new PostsService();
    this.eiService = new EducationLevelService();
    this.peiService = new PostsEductionalInstitutionsService();
  }
  async Add({
    body,
    set,
    params: { id },
  }: {
    body: TPostEducationalInstitutionsCreateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      const [postsExists, eiExists, peiExists] = await Promise.all([
        this.pService.FindOne(id),
        this.eiService.FindOne(body.eiId),
        this.peiService.FindAlready({ pId: id, eiId: body.eiId }),
      ]);
      if (peiExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,eiId",
        });

      if (!postsExists || !eiExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? "post" : "educationalInstitions"
          }`,
          error: `${!postsExists ? "pId" : "eiId"}`,
        });

      const result = await this.peiService.Create({ eiId: body.eiId, pId: id });
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
    body: TPostEducationalInstitutionsCreateBodyDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const [postsExists, eiExists, peiExists] = await Promise.all([
        this.pService.FindOne(id),
        this.eiService.FindOne(body.eiId),
        this.peiService.FindAlready({ pId: id, eiId: body.eiId }),
      ]);
      if (peiExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,eiId",
        });

      if (!postsExists || !eiExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? "post" : "educationalInstitions"
          }`,
          error: `${!postsExists ? "pId" : "eiId"}`,
        });

      const resutl = await this.peiService.Update(_Id, body);
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
      const peiExists = await this.peiService.FindOne(_Id);
      if (!peiExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key}`,
        });
      const result = await this.peiService.Delete(_Id);
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
