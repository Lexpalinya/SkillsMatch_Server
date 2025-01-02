import { PrismaClient } from "@prisma/client";
import { PostsService } from "../../../services/companies/posts/posts.service";
import { PostsJobPositionsDetailsService } from "../../../services/companies/posts/jobPositionDetails.service";
import { PostsStudyCourseService } from "../../../services/companies/posts/studyCourse.service";
import { ResFail, ResFail500, ResSucess } from "../../../utils/response";
import { EMessage } from "../../../utils/message";
import { CacheDataUpdate } from "../../../utils/cache.control";
import {
  TPostJobPositionsDetailsCreateBodyDTU,
  TPostJobPositionsDetailsCreateDTU,
  TPostJobPositionsDetailsUpdateDTU,
} from "../../../types/Companies/posts/jobPositionsDetails.type";
import {
  TParams,
  TParams_,
  TSet,
} from "../../../types/utils/elysiaCustom.typs";
import { JobPositionsService } from "../../../services/Combo/jobPositions.service";
import {
  converStringToArray,
  converStringToFloat,
} from "../../../utils/converData";
import { validateElementsExists } from "../../../utils/validate";
import {
  AddIdObjectInArrayPostsJobPositionsDetails,
  DeduplicateArray,
} from "../../../utils/controArrary";
import { SkillsService } from "../../../services/Combo/skills.service";
import { TJobPositionsDetails } from "../../../types/Companies/posts/posts.type";
import { PostsJobPositionDetailsSkillsService } from "../../../services/companies/posts/jobPositionDetailsSkills.service";
import { TPostJobPositionDetailsSkillsCreateDTU } from "../../../types/Companies/posts/jobPositionDetailsSkills.type";

export class PostsJobPositionsDetailsController {
  private key: string;
  private model: keyof PrismaClient;
  private pService: PostsService;
  private pJPDService: PostsJobPositionsDetailsService;
  private sService: SkillsService;
  private jpService: JobPositionsService;
  private pjpdsService: PostsJobPositionDetailsSkillsService;
  constructor() {
    this.model = "posts";
    this.key = String(this.model);
    this.pService = new PostsService();
    this.pJPDService = new PostsJobPositionsDetailsService();
    this.sService = new SkillsService();
    this.jpService = new JobPositionsService();
    this.pjpdsService = new PostsJobPositionDetailsSkillsService();
  }

  async Add({
    body,
    set,
    params: { id },
  }: {
    body: TPostJobPositionsDetailsCreateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      const [pExists, jpExists, pjpExists] = await Promise.all([
        this.pService.FindOne(id),
        this.jpService.FindOne(body.jpId),
        this.pJPDService.FindAlready({ pId: id, jpId: body.jpId }),
      ]);

      if (pjpExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,jpId",
        });

      if (!pExists || !jpExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !pExists ? "post" : "jobPosition"
          }`,
          error: `${!pExists ? "pId" : "jpId"}`,
        });

      if (body.amount) body.amount = converStringToFloat(body.amount);
      if (body.sId) {
        body.sId = DeduplicateArray(converStringToArray(body.sId));
        await validateElementsExists(body.sId, this.sService, set, "skills");
      }

      const pjp = await this.pJPDService.Create(
        body as TPostJobPositionsDetailsCreateDTU
      );
      if (body.sId) {
        const addSkillData: TPostJobPositionDetailsSkillsCreateDTU[] =
          AddIdObjectInArrayPostsJobPositionsDetails(
            pjp.id,
            body.sId as String[],
            "sId"
          );

        const result = await this.pjpdsService.CreateMany(addSkillData);
        console.log("result", result);
      }
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
      if (error instanceof Error) {
        const err: Error = error;

        // Handle not found error
        if (err.message.includes(EMessage.ERROR_NOT_FOUND)) {
          const str = err.message.split(" ");
          return ResFail({
            set,
            statusCode: 404,
            message: `${EMessage.ERROR_NOT_FOUND} ${str[3]}`,
            error: `id:${str[5]}`,
          });
        }
      }
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
    body: TPostJobPositionsDetailsUpdateDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      let promiseList: any[] = [this.pService.FindOne(id)];

      if (body.jpId) {
        promiseList.push(this.jpService.FindOne(body.jpId));
        promiseList.push(
          this.pJPDService.FindAlready({ pId: id, jpId: body.jpId })
        );
      }
      const [pExists, jpExists, pjpExists] = await Promise.all(promiseList);

      if (body.jpId && pjpExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pId,jpId",
        });

      if (!pExists || (body.jpId && !jpExists))
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !pExists ? "post" : "jobPosition"
          }`,
          error: `${!pExists ? "pId" : "jpId"}`,
        });

      if (body.amount) body.amount = converStringToFloat(body.amount);
      const result = await this.pJPDService.Update(_Id, body);
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
      const pJPSExists = await this.pJPDService.FindOne(_Id);
      if (!pJPSExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key}`,
        });
      const result = await this.pJPDService.Delete(_Id);
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
