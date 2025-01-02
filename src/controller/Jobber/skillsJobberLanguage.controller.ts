import { converStringToFloat } from "./../../utils/converData";
import { PrismaClient } from "@prisma/client";
import { SkillsJobbberService } from "../../services/Jobber/skillsJobber.service";
import { TParams, TParams_, TSet } from "../../types/utils/elysiaCustom.typs";
import { ResFail, ResFail500, ResSucess } from "../../utils/response";
import { EMessage } from "../../utils/message";
import { CacheDataUpdate } from "../../utils/cache.control";
import { LanguagesService } from "../../services/Combo/languages.service";
import { SkillsJobberLanguageService } from "../../services/Jobber/skillsJobberLanguage.service";
import {
  TSkillsJobberLanguageCreateBodyDTU,
  TSkillsJobberLanguageCreateDTU,
} from "../../types/Jobber/skillsJobberLanguage.type";

export class SkillsJobberLanguageController {
  private SJService: SkillsJobbberService;
  private SJLanguageService: SkillsJobberLanguageService;
  private LanguageService: LanguagesService;
  private keys: string;
  private model: keyof PrismaClient;
  private modelSJ: keyof PrismaClient;
  private keysSJ: string;
  constructor() {
    this.model = "skillJobberLanguage";
    this.modelSJ = "skillJobber";
    this.keysSJ = String(this.modelSJ);
    this.keys = String(this.model);
    this.SJLanguageService = new SkillsJobberLanguageService();
    this.SJService = new SkillsJobbberService();
    this.LanguageService = new LanguagesService();
  }

  async Create({
    body,
    set,
    params: { id },
  }: {
    body: TSkillsJobberLanguageCreateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      const [jobPositionExists, skillsJobberExists, SJLanguagesExists] =
        await Promise.all([
          this.LanguageService.FindOne(body.lId),
          this.SJService.FindOne(id),
          this.SJLanguageService.FindAlready({
            lId: body.lId,
            sjId: id,
          }),
        ]);

      if (SJLanguagesExists)
        return ResFail({
          set,
          message: `${EMessage.ALREADY} ${this.keys}`,
          error: "lId,sjId",
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

      const result = await this.SJLanguageService.Create({
        lId: body.lId,
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
        message: `${EMessage.SUCCESS_UPDATE_ADD} ${this.keysSJ}`,
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
    body: TSkillsJobberLanguageCreateBodyDTU;
    set: TSet;
    params: TParams_;
  }) {
    try {
      const _Id = converStringToFloat(_id);
      const [
        jobPositionExists,
        skillsJobberExists,
        SJLanguagesExists,
        SJJobPositionFoundExists,
      ] = await Promise.all([
        this.LanguageService.FindOne(body.lId),
        this.SJService.FindOne(id),
        this.SJLanguageService.FindAlready({
          lId: body.lId,
          sjId: id,
        }),
        this.SJLanguageService.FindOne(_Id),
      ]);

      if (!SJJobPositionFoundExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.keysSJ}`,
          error: "id",
        });
      if (SJLanguagesExists)
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

      const result = await this.SJLanguageService.Update(_Id, body);

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
      const SJLanguagesExists = await this.SJLanguageService.FindOne(_Id);
      if (!SJLanguagesExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.keysSJ}`,
          error: "id",
        });

      if (id !== SJLanguagesExists.sjId)
        return ResFail({
          set,
          statusCode: 400,
          message: `${EMessage.THIS_YOU_NOT_OWNER} ${this.keysSJ}`,
          error: "id",
        });
      const result = await this.SJLanguageService.Delete(_Id);
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
