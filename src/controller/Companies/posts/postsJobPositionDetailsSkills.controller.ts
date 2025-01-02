import { TPostJobPositionDetailsSkillsUpdateDTU } from "./../../../types/Companies/posts/jobPositionDetailsSkills.type";
import { PrismaClient } from "@prisma/client";
import { PostsService } from "../../../services/companies/posts/posts.service";

import {
  TParams_,
  TParams__,
  TSet,
} from "../../../types/utils/elysiaCustom.typs";
import { EMessage } from "../../../utils/message";
import { ResFail, ResFail500, ResSucess } from "../../../utils/response";

import { CacheDataUpdate } from "../../../utils/cache.control";
import { converStringToFloat } from "../../../utils/converData";
import { TPostJobPositionDetailsSkillsCreateBodyyDTU } from "../../../types/Companies/posts/jobPositionDetailsSkills.type";
import { PostsJobPositionDetailsSkillsService } from "../../../services/companies/posts/jobPositionDetailsSkills.service";
import { SkillsService } from "../../../services/Combo/skills.service";
import { PostsJobPositionsDetailsService } from "../../../services/companies/posts/jobPositionDetails.service";

export class PostJobPositionDetailSkillController {
  private key: string;
  private keyPJPDS: string;
  private modelPJPDS: keyof PrismaClient;
  private model: keyof PrismaClient;
  private pService: PostsService;
  private pjpService: PostsJobPositionsDetailsService;
  private pjpdsService: PostsJobPositionDetailsSkillsService;
  private sService: SkillsService;
  constructor() {
    this.model = "posts";
    this.modelPJPDS = "postJobPositionsDetailsSkills";
    this.keyPJPDS = String(this.modelPJPDS);
    this.key = String(this.model);
    this.pService = new PostsService();
    this.sService = new SkillsService();
    this.pjpService = new PostsJobPositionsDetailsService();
    this.pjpdsService = new PostsJobPositionDetailsSkillsService();
  }
  async Add({
    body,
    set,
    params: { id, _id },
  }: {
    body: TPostJobPositionDetailsSkillsCreateBodyyDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const [pExists, sExists, pjpExists, pjpdsExists] = await Promise.all([
        this.pService.FindOne(id),
        this.sService.FindOne(body.sId),
        this.pjpService.FindOne(_Id),
        this.pjpdsService.FindAlready({ pjpId: _Id, sId: body.sId }),
      ]);

      if (pjpdsExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pjpId,sId",
        });

      if (!pExists || !sExists || !pjpExists)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !pExists ? "post" : !sExists ? "skills" : "postjobpositiondetails"
          }`,
          error: `${!pExists ? "pId" : !sExists ? "sId" : "pjpId"}`,
        });

      const result = await this.pjpdsService.Create({
        pjpId: _Id,
        sId: body.sId,
      });
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
    params: { id, _id, _ids },
  }: {
    body: TPostJobPositionDetailsSkillsUpdateDTU;
    set: TSet;
    params: TParams__;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const _Ids = converStringToFloat(_ids);

      const [pExists, sExists, pjpExists, pjpdsExists, pjpdsExistsId] =
        await Promise.all([
          this.pService.FindOne(id),
          this.sService.FindOne(body.sId),
          this.pjpService.FindOne(_Id),
          this.pjpdsService.FindAlready({ pjpId: _Id, sId: body.sId }),
          this.pjpdsService.FindOne(_Ids),
        ]);

      if (pjpdsExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.key}`,
          error: "pjpId,sId",
        });

      if (!pExists || !sExists || !pjpExists || !pjpdsExistsId)
        return ResFail({
          set,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !pExists
              ? "post"
              : !sExists
              ? "skills"
              : !pjpExists
              ? "postjobpositiondetails"
              : "postjobpositiondetailsSkill"
          }`,
          error: `${
            !pExists ? "pId" : !sExists ? "sId" : !pjpExists ? "pjpId" : "_ids"
          }`,
        });

      const result = await this.pjpdsService.Update(_Ids, body);

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
  async Delete({
    set,
    params: { id, _id, _ids },
  }: {
    set: TSet;
    params: TParams__;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const _Ids = converStringToFloat(_ids);

      const [pjpExists, pjpdsExistsId] = await Promise.all([
        this.pjpService.FindOne(_Id),
        this.pjpdsService.FindOne(_Ids),
      ]);

      if (!pjpExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !pjpExists ? "postJobPositionDetail" : "postJobPositionDetailSkills"
          }`,
          error: `${!pjpExists ? "pjpId" : "pjpdsId"}`,
        });

      const result = await this.pjpdsService.Delete(_Ids);

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
