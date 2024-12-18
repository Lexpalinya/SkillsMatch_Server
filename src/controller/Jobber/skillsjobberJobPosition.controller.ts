import { converStringToFloat } from "./../../utils/converData";
import { PrismaClient } from "@prisma/client";
import { SkillsJobbberService } from "../../services/Jobber/skillsJobber.service";
import { SkillsJobberJobPositionsService } from "../../services/Jobber/skillsJobberJobPosition.service";
import {
  TSkillsJobberJobPositionsCreateBodyDTU,
  TSkillsJobberJobPositionsCreateDTU,
} from "../../types/Jobber/skillsJobberJobPositions.type";
import { TParams, TParams_, TSet } from "../../types/utils/elysiaCustom.typs";
import { JobPositionsService } from "../../services/Combo/jobPositions.service";
import { ResFail, ResFail500, ResSucess } from "../../utils/response";
import { EMessage } from "../../utils/message";
import { CacheDataUpdate } from "../../utils/cache.control";

export class SkillsJobberJobPositionsController {
  private SJService: SkillsJobbberService;
  private SJJobPositionsService: SkillsJobberJobPositionsService;
  private JobPostionsService: JobPositionsService;
  private keys: string;
  private model: keyof PrismaClient;
  private modelSJ: keyof PrismaClient;
  private keysSJ: string;
  constructor() {
    this.model = "skillJobberJobPositions";
    this.modelSJ = "skillJobber";
    this.keysSJ = String(this.modelSJ);
    this.keys = String(this.model);
    this.SJJobPositionsService = new SkillsJobberJobPositionsService();
    this.SJService = new SkillsJobbberService();
    this.JobPostionsService = new JobPositionsService();
  }

  async Create({
    body,
    set,
    params: { id },
  }: {
    body: TSkillsJobberJobPositionsCreateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      const [jobPositionExists, skillsJobberExists, SJJobPositionExists] =
        await Promise.all([
          this.JobPostionsService.FindOne(body.jpId),
          this.SJService.FindOne(id),
          this.SJJobPositionsService.FindAlready({
            jpId: body.jpId,
            sjId: id,
          }),
        ]);

      if (SJJobPositionExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} SkillJobberJobPositions`,
          error: "jpId,sjId",
        });

      if (!jobPositionExists || !skillsJobberExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !jobPositionExists ? "jobPosition" : "skillsJobber"
          }`,
          error: `${!jobPositionExists ? "jpId" : "sjId"}`,
        });

      const result = await this.SJJobPositionsService.Create({
        jpId: body.jpId,
        sjId: id,
      });

      const [allData, updateData] = await Promise.all([
        this.SJService.FindMany(),
        this.SJService.FindUnique(id),
      ]);

      if (updateData) CacheDataUpdate(this.keysSJ, updateData, allData);
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_UPDATE} ${this.keysSJ}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE_ADD}  ${this.keysSJ}`,
        error: { error },
      });
    }
  }

  async Update({
    body,
    set,
    params: { id, _id },
  }: {
    body: TSkillsJobberJobPositionsCreateBodyDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const [
        jobPositionExists,
        skillsJobberExists,
        SJJobPositionExists,
        SJJobPositionFoundExists,
      ] = await Promise.all([
        this.JobPostionsService.FindOne(body.jpId),
        this.SJService.FindOne(id),
        this.SJJobPositionsService.FindAlready({
          jpId: body.jpId,
          sjId: id,
        }),
        this.SJJobPositionsService.FindOne(_Id),
      ]);

      if (!SJJobPositionFoundExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.keysSJ}`,
          error: "id",
        });
      if (SJJobPositionExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} SkillJobberJobPositions`,
          error: "jpId,sjId",
        });

      if (!jobPositionExists || !skillsJobberExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !jobPositionExists ? "jobPosition" : "skillsJobber"
          }`,
          error: `${!jobPositionExists ? "jpId" : "sjId"}`,
        });

      const result = await this.SJJobPositionsService.Update(_Id, {
        jpId: body.jpId,
        sjId: id,
      });

      const [allData, updateData] = await Promise.all([
        this.SJService.FindMany(),
        this.SJService.FindUnique(id),
      ]);

      if (updateData) CacheDataUpdate(this.keysSJ, updateData, allData);
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_UPDATE_UPDATE} ${this.keysSJ}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE_UPDATE} ${this.keysSJ}`,
        error: { error },
      });
    }
  }

  async Delete({ set, params: { id, _id } }: { set: TSet; params: TParams_ }) {
    try {
      const _Id = converStringToFloat(_id);
      const SJJobPositionExists = await this.SJJobPositionsService.FindOne(_Id);
      if (!SJJobPositionExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.keysSJ}`,
          error: "id",
        });

      if (id !== SJJobPositionExists.sjId)
        return ResFail({
          set,
          statusCode: 400,
          message: `${EMessage.THIS_YOU_NOT_OWNER} ${this.keysSJ}`,
          error: "id",
        });

      const result = await this.SJJobPositionsService.Delete(_Id);
      const [allData, updateData] = await Promise.all([
        this.SJService.FindMany(),
        this.SJService.FindUnique(id),
      ]);

      if (updateData) CacheDataUpdate(this.keysSJ, updateData, allData);
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_UPDATE_DELETE} ${this.keysSJ}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE_DELETE} ${this.keysSJ}`,
        error: { error },
      });
    }
  }
}
