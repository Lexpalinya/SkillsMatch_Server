import { converStringToFloat } from "./../../utils/converData";
import { PrismaClient } from "@prisma/client";
import { SkillsJobbberService } from "../../services/Jobber/skillsJobber.service";
import { TParams, TParams_, TSet } from "../../types/utils/elysiaCustom.typs";
import { ResFail, ResFail500, ResSucess } from "../../utils/response";
import { EMessage } from "../../utils/message";
import { CacheDataUpdate } from "../../utils/cache.control";
import { SkillsJobberSkillService } from "../../services/Jobber/skillsJobberSkills.service";
import { SkillsService } from "../../services/Combo/skills.service";
import {
  TSkillsJobberSkillsCreateBodyDTU,
  TSkillsJobberSkillsCreateDTU,
} from "../../types/Jobber/skillsJobberSkills.type";

export class SkillsJobberSkillsController {
  private SJService: SkillsJobbberService;
  private SJSkillsService: SkillsJobberSkillService;
  private SkillsService: SkillsService;
  private keys: string;
  private model: keyof PrismaClient;
  private modelSJ: keyof PrismaClient;
  private keysSJ: string;
  constructor() {
    this.model = "skillJobberSkills";
    this.modelSJ = "skillJobber";
    this.keysSJ = String(this.modelSJ);
    this.keys = String(this.model);
    this.SJSkillsService = new SkillsJobberSkillService();
    this.SkillsService = new SkillsService();

    this.SJService = new SkillsJobbberService();
  }

  async Create({
    body,
    set,
    params: { id },
  }: {
    body: TSkillsJobberSkillsCreateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      const [skillsExists, skillsJobberExists, SJSkillsExists] =
        await Promise.all([
          this.SkillsService.FindOne(body.sId),
          this.SJService.FindOne(id),
          this.SJSkillsService.FindAlready({
            sId: body.sId,
            sjId: id,
          }),
        ]);

      if (SJSkillsExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.keys}`,
          error: "sId,sjId",
        });

      console.log("first", SJSkillsExists);
      if (!skillsExists || !skillsJobberExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !skillsExists ? "skills" : "skillsJobber"
          }`,
          error: `${!skillsExists ? "sId" : "sjId"}`,
        });

      const result = await this.SJSkillsService.Create({
        sId: body.sId,
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
    body: TSkillsJobberSkillsCreateBodyDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const [
        jobPositionExists,
        skillsJobberExists,
        SJSkillsExists,
        SJJobPositionFoundExists,
      ] = await Promise.all([
        this.SkillsService.FindOne(body.sId),
        this.SJService.FindOne(id),
        this.SJSkillsService.FindAlready({
          sId: body.sId,
          sjId: id,
        }),
        this.SJSkillsService.FindOne(_Id),
      ]);

      if (!SJJobPositionFoundExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.keysSJ}`,
          error: "id",
        });
      if (SJSkillsExists)
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

      const result = await this.SJSkillsService.Update(_Id, {
        sId: body.sId,
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
      const SJSkillsExists = await this.SJSkillsService.FindOne(_Id);
      if (!SJSkillsExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.keysSJ}`,
          error: "id",
        });
      if (id !== SJSkillsExists.sjId)
        return ResFail({
          set,
          statusCode: 400,
          message: `${EMessage.THIS_YOU_NOT_OWNER} ${this.keysSJ}`,
          error: "id",
        });

      const result = await this.SJSkillsService.Delete(_Id);
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
