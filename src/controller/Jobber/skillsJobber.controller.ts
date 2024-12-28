import { PrismaClient } from "@prisma/client";
import { SkillsJobberJobPositionsService } from "../../services/Jobber/skillsJobberJobPosition.service";
import { SkillsJobberLanguageService } from "../../services/Jobber/skillsJobberLanguage.service";

import { UserService } from "../../services/user.service";
import {
  TSkillsJobberCreateBodyDTU,
  TSkillsJobberCreateDTU,
  TSkillsJobberUpdateBodyDTU,
  TSkillsJobberUpdateDTU,
} from "../../types/Jobber/skillsJobber.type";
import { ResFail, ResFail500, ResSucess } from "../../utils/response";
import { EMessage } from "../../utils/message";
import {
  TParams,
  TQueryUserId,
  TSet,
} from "../../types/utils/elysiaCustom.typs";
import { SkillsJobbberService } from "../../services/Jobber/skillsJobber.service";
import {
  converStringToArray,
  converStringToFloat,
} from "../../utils/converData";
import { EducationLevelService } from "../../services/Combo/eductionLevel.service";
import { EducationalInstitutionsService } from "../../services/Combo/educationInstitustions.service";
import { FacultyService } from "../../services/Combo/facultys.service";
import { StudyCourseService } from "../../services/Combo/studyCourse.service";
import { AddIdObjectInArrayPosts, DeduplicateArray } from "../../utils/controArrary";
import { TSkillsJobberLanguageCreateDTU } from "../../types/Jobber/skillsJobberLanguage.type";
import { TSkillsJobberSkillsCreateDTU } from "../../types/Jobber/skillsJobberSkills.type";
import { TSkillsJobberJobPositionsCreateDTU } from "../../types/Jobber/skillsJobberJobPositions.type";
import { SkillsJobberSkillService } from "../../services/Jobber/skillsJobberSkills.service";
import { SkillsService } from "../../services/Combo/skills.service";
import { LanguagesService } from "../../services/Combo/languages.service";
import { JobPositionsService } from "../../services/Combo/jobPositions.service";
import { validateElementsExists } from "../../utils/validate";
import { CacheDataAdd, CacheDataUpdate } from "../../utils/cache.control";

export class SkillsJobbersController {
  private SJLanguageService: SkillsJobberLanguageService;
  private SJSkillsService: SkillsJobberSkillService;
  private SJJobPositionsService: SkillsJobberJobPositionsService;
  private SJService: SkillsJobbberService;
  private userService: UserService;
  private key: string;
  private model: keyof PrismaClient;
  private ElService: EducationLevelService;
  private EiService: EducationalInstitutionsService;
  private FService: FacultyService;
  private ScService: StudyCourseService;
  private skillsService: SkillsService;
  private languagesService: LanguagesService;
  private jobPositionsService: JobPositionsService;
  constructor() {
    this.SJJobPositionsService = new SkillsJobberJobPositionsService();
    this.SJLanguageService = new SkillsJobberLanguageService();
    this.SJSkillsService = new SkillsJobberSkillService();
    this.SJService = new SkillsJobbberService();
    this.userService = new UserService();
    this.ElService = new EducationLevelService();
    this.EiService = new EducationalInstitutionsService();
    this.FService = new FacultyService();
    this.ScService = new StudyCourseService();
    this.skillsService = new SkillsService();
    this.languagesService = new LanguagesService();
    this.jobPositionsService = new JobPositionsService();
    this.model = "skillJobber";
    this.key = String(this.model);
  }

  async Create({
    body,
    set,
    query,
  }: {
    body: TSkillsJobberCreateBodyDTU;
    set: TSet;
    query: TQueryUserId;
  }) {
    try {
      const userId = query?.userId || set.user!.id;
      body.gpa = converStringToFloat(body.gpa);

      let startSalary;
      body.workDay = DeduplicateArray(converStringToArray(body.workDay));
      if (body.startSalary) startSalary = converStringToFloat(body.startSalary);

      /**
       * conver string to array and Deduplicate
       */
      body.skills = DeduplicateArray(converStringToArray(body.skills));
      body.languages = DeduplicateArray(converStringToArray(body.languages));
      body.jobPositions = DeduplicateArray(
        converStringToArray(body.jobPositions)
      );

      const [SJUserExists, userExists, ElExists, EiExists, FExists, ScExists] =
        await Promise.all([
          this.SJService.FindUserIdExists(userId),
          this.userService.findOne(userId),
          this.ElService.FindOne(body.elId),
          this.EiService.FindOne(body.eiId),
          this.FService.FindOne(body.fId),
          this.ScService.FindOne(body.scId),
        ]);

      if (SJUserExists) {
        return ResFail({
          set,
          message: `${EMessage.ERROR_USER_EXISTS} ${this.key}`,
          error: "userId",
        });
      }
      // Check for missing entities
      if (!userExists || !ElExists || !EiExists || !FExists || !ScExists) {
        const missingEntity = !userExists
          ? "user"
          : !ElExists
          ? "educationLevels"
          : !EiExists
          ? "educationalInstitutions"
          : !FExists
          ? "facultys"
          : "ScEntity"; // Adjust names based on your domain logic

        const missingField = !userExists
          ? "userId"
          : !ElExists
          ? "elId"
          : !EiExists
          ? "eiId"
          : !FExists
          ? "fId"
          : "scId";

        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${missingEntity}`,
          error: missingField,
        });
      }

      await validateElementsExists(
        body.skills,
        this.skillsService,
        set,
        "skills"
      );
      await validateElementsExists(
        body.languages,
        this.languagesService,
        set,
        "language"
      );
      await validateElementsExists(
        body.jobPositions,
        this.jobPositionsService,
        set,
        "jobPostion"
      );

      const createData: TSkillsJobberCreateDTU = {
        userId,
        elId: body.elId,
        eiId: body.eiId,
        fId: body.fId,
        scId: body.scId,
        gpa: body.gpa,
        drivingCardType: body.drivingCardType ?? null, // Normalize undefined to null
        more: body.more,
        startSalary: startSalary ?? null, // Normalize undefined to null
        currency: body.currency,
        workDay: body.workDay,
        checkInTime: body.checkInTime ?? null,
        checkOutTime: body.checkOutTime ?? null,
      };

      const skillJobber = await this.SJService.Create(createData);

      const SJLanguageData: TSkillsJobberLanguageCreateDTU[] =
        AddIdObjectInArrayPosts(skillJobber.id, body.languages, "lId");
      const SJSkilsData: TSkillsJobberSkillsCreateDTU[] = AddIdObjectInArrayPosts(
        skillJobber.id,
        body.skills,
        "sId"
      );
      const SJSJobPositionData: TSkillsJobberJobPositionsCreateDTU[] =
        AddIdObjectInArrayPosts(skillJobber.id, body.jobPositions, "jpId");

      const data = await Promise.all([
        this.SJJobPositionsService.CreateMany(SJSJobPositionData),
        this.SJLanguageService.CreateMany(SJLanguageData),
        this.SJSkillsService.CreateMany(SJSkilsData),
      ]);

      const [allData, newData] = await Promise.all([
        this.SJService.FindMany(),
        this.SJService.FindUnique(skillJobber.id),
      ]);

      CacheDataAdd(this.key, newData, allData);

      return ResSucess({
        set,
        statusCode: 201,
        message: `${EMessage.SUCCESS_INSERT} ${this.key}`,
        data: newData,
      });
    } catch (error) {
      if (error instanceof Error) {
        const err: Error = error;
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
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_INSERT}  ${this.key}`,
        error: { error },
      });
    }
  }

  async Update({
    body,
    set,
    params: { id },
  }: {
    body: TSkillsJobberUpdateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      if (body.gpa) body.gpa = converStringToFloat(body.gpa);
      if (body.workDay) body.workDay = converStringToArray(body.workDay);
      if (body.startSalary)
        body.startSalary = converStringToFloat(body.startSalary);

      const promiseList: Promise<any>[] = [this.SJService.FindOne(id)];
      if (body.elId) promiseList.push(this.ElService.FindOne(body.elId));
      if (body.eiId) promiseList.push(this.EiService.FindOne(body.eiId));
      if (body.fId) promiseList.push(this.FService.FindOne(body.fId));
      if (body.scId) promiseList.push(this.ScService.FindOne(body.scId));

      let resultPromise = await Promise.all(promiseList);

      let SJExists = resultPromise.shift(),
        ElExists,
        EiExists,
        FExists,
        ScExists;

      if (!SJExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}`,
          error: "id",
        });

      if (body.elId) ElExists = resultPromise.shift();
      if (body.eiId) EiExists = resultPromise.shift();
      if (body.fId) FExists = resultPromise.shift();
      if (body.scId) ScExists = resultPromise.shift();

      // Check for missing related entities
      const missingEntity = this.getMissingEntity({
        ElExists,
        EiExists,
        FExists,
        ScExists,
        body,
      });

      if (missingEntity) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${missingEntity.entity}`,
          error: missingEntity.field,
        });
      }
      const update = await this.SJService.Update(
        id,
        body as TSkillsJobberUpdateDTU
      );

      const [allData, updateData] = await Promise.all([
        this.SJService.FindMany(),
        this.SJService.FindUnique(id),
      ]);
      if (updateData) CacheDataUpdate(this.key, updateData, allData);

      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_UPDATE} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE}  ${this.key}`,
        error: { error },
      });
    }
  }

  private getMissingEntity({
    ElExists,
    EiExists,
    FExists,
    ScExists,
    body,
  }: {
    ElExists?: any;
    EiExists?: any;
    FExists?: any;
    ScExists?: any;
    body: TSkillsJobberUpdateBodyDTU;
  }): { entity: string; field: string } | null {
    if (body.elId && !ElExists)
      return { entity: "educationLevels", field: "elId" };
    if (body.eiId && !EiExists)
      return { entity: "educationalInstitutions", field: "eiId" };
    if (body.fId && !FExists) return { entity: "facultys", field: "fId" };
    if (body.scId && !ScExists) return { entity: "ScEntity", field: "scId" };
    return null;
  }

  async SelectAll({ set }: { set: TSet }) {
    try {
      const result = await this.SJService.FindMany();
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_FETCH_ALL} ${this.key}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL}  ${this.key}`,
        error: { error },
      });
    }
  }

  async SelectOne({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      const result = await this.SJService.FindOne(id);
      if (!result)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}`,
          error: "id",
        });
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_FETCH_ONE} ${this.key}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE}  ${this.key}`,
        error: { error },
      });
    }
  }
}
