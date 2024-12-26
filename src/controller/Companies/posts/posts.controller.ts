import {
  AddIdObjectInArray,
  AddIdObjectInArrayPosts,
} from "./../../../utils/controArrary";
import {
  TPostCreateDTU,
  TPostsDTU,
} from "./../../../types/Companies/posts/posts.type";
import { PrismaClient } from "@prisma/client";
import {
  TJobPositionsDetails,
  TPostsCreateBodyDTU,
} from "../../../types/Companies/posts/posts.type";
import { TSet } from "../../../types/utils/elysiaCustom.typs";
import { ResFail, ResFail500, ResSucess } from "../../../utils/response";
import { EMessage } from "../../../utils/message";
import { PostsService } from "../../../services/companies/posts/posts.service";
import { UserService } from "../../../services/user.service";
import { PostsFacultysService } from "../../../services/companies/posts/faculty.service";
import { PostsJobPositionsDetailsService } from "../../../services/companies/posts/jobPositionDetails.service";
import { PostsJobPositionDetailsSkillsService } from "../../../services/companies/posts/jobPositionDetailsSkills.service";
import { PostsLanguagesService } from "../../../services/companies/posts/language.service";
import { PostsStudyCourseService } from "../../../services/companies/posts/studyCourse.service";
import { FacultyService } from "../../../services/Combo/facultys.service";
import { LanguagesService } from "../../../services/Combo/languages.service";
import { StudyCourseService } from "../../../services/Combo/studyCourse.service";
import { SkillsService } from "../../../services/Combo/skills.service";
import { CompaniesService } from "../../../services/companies/companiees.service";
import { DeduplicateArray } from "../../../utils/controArrary";
import {
  converStringToArray,
  converStringToFloat,
} from "../../../utils/converData";
import {
  validateElementsExists,
  validateElementsJobPositionDetailsExists,
} from "../../../utils/validate";
import { EducationalInstitutionsService } from "../../../services/Combo/educationInstitustions.service";
import { UploadImage } from "../../../utils/upload";
import { TPostStudyCourseCreateDTU } from "../../../types/Companies/posts/studyCourse.type";
import { TPostFacultysCreateDTU } from "../../../types/Companies/posts/faculty.types";
import { TPostLanguageCreateDTU } from "../../../types/Companies/posts/language.type";
import { CacheDataAdd } from "../../../utils/cache.control";

export class PostsController {
  private key: string;
  private model: keyof PrismaClient;
  private pService: PostsService;
  private usersService: UserService;
  private pFService: PostsFacultysService;
  private pJPDService: PostsJobPositionsDetailsService;
  private pJPDSService: PostsJobPositionDetailsSkillsService;
  private pLService: PostsLanguagesService;
  private pSCService: PostsStudyCourseService;
  private sService: SkillsService;
  private fService: FacultyService;
  private lService: LanguagesService;
  private scService: StudyCourseService;
  private cService: CompaniesService;
  private eIService: EducationalInstitutionsService;
  constructor() {
    this.model = "posts";
    this.key = String(this.model);
    this.pService = new PostsService();
    this.usersService = new UserService();
    this.pJPDService = new PostsJobPositionsDetailsService();
    this.pFService = new PostsFacultysService();
    this.pJPDSService = new PostsJobPositionDetailsSkillsService();
    this.pLService = new PostsLanguagesService();
    this.pSCService = new PostsStudyCourseService();
    this.fService = new FacultyService();
    this.lService = new LanguagesService();
    this.scService = new StudyCourseService();
    this.sService = new SkillsService();
    this.cService = new CompaniesService();
    this.eIService = new EducationalInstitutionsService();
  }

  async Create({ body, set }: { body: TPostsCreateBodyDTU; set: TSet }) {
    try {
      /**
       * conver string to array and Deduplicate
       */
      body.languages = DeduplicateArray(converStringToArray(body.languages));
      body.facultys = DeduplicateArray(converStringToArray(body.facultys));
      body.studyCourses = DeduplicateArray(
        converStringToArray(body.studyCourses)
      );
      body.jobpositionsDetails = DeduplicateArray(
        converStringToArray(body.jobpositionsDetails)
      );
      body.educationalInstitutions = DeduplicateArray(
        converStringToArray(body.educationalInstitutions)
      );

      /**
       * check undifined and null and empty string
       */

      if (body.gpa) body.gpa = converStringToFloat(body.gpa);
      if (body.startSalary)
        body.startSalary = converStringToFloat(body.startSalary);
      if (body.endSalary) body.endSalary = converStringToFloat(body.endSalary);

      const [companiesExists] = await Promise.all([
        this.cService.FindOne(body.cId),
      ]);

      if (!companiesExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} companies`,
          error: "id",
        });
      await validateElementsExists(
        body.languages,
        this.lService,
        set,
        "languages"
      );
      await validateElementsExists(
        body.studyCourses,
        this.scService,
        set,
        "studyCourses"
      );
      await validateElementsExists(
        body.educationalInstitutions,
        this.eIService,
        set,
        "educationalInstitutions"
      );
      await validateElementsExists(
        body.facultys,
        this.fService,
        set,
        "facultys"
      );
      await validateElementsJobPositionDetailsExists(body.jobpositionsDetails);
      let images: string[] = [];
      if (body.images) {
        const promiseList = body.images.map((img) => UploadImage(img));
        images = await Promise.all(promiseList);
      }
      const createData: TPostCreateDTU = {
        cId: body.cId,
        title: body.title,
        images: images,
        endDate: body.endDate ? new Date(body.endDate) : null,
        currency: body.currency,
        workDay: body.workDay,
        checkInTime: body.checkInTime,
        checkOutTime: body.checkOutTime,
        gpa: Number(body.gpa),
        startSalary:
          body.startSalary !== undefined ? Number(body.startSalary) : null,
        endSalary: body.endSalary !== undefined ? Number(body.endSalary) : null,
        more: body.more,
        welfare: body.welfare,
      };
      const posts = await this.pService.Create(createData);
      const pLanguageData: TPostLanguageCreateDTU[] = AddIdObjectInArrayPosts(
        posts.id,
        body.languages,
        "lId"
      );
      const pStudyCourseData: TPostStudyCourseCreateDTU[] =
        AddIdObjectInArrayPosts(posts.id, body.studyCourses, "scId");
      const pFacultysData: TPostFacultysCreateDTU[] = AddIdObjectInArrayPosts(
        posts.id,
        body.facultys,
        "fId"
      );

      const data = await Promise.all([
        this.pLService.CreateMany(pLanguageData),
        this.pSCService.CreateMany(pStudyCourseData),
        this.pFService.CreateMany(pFacultysData),
      ]);
      const pJobPositionsDetailsData: TJobPositionsDetails[] =
        AddIdObjectInArrayPosts(posts.id, body.jobpositionsDetails, "jpId");

      const [allData, newData] = await Promise.all([
        this.pService.FindMany(),
        this.pService.FindUnique(posts.id),
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
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_INSERT} ${this.key}`,
        error: { error },
      });
    }
  }
}
