import {
  AddDataInArray,
  AddIdObjectInArrayPosts,
  RemoveDataInArray,
} from "./../../../utils/controArrary";
import {
  TPostCreateDTU,
  TPostsUpdaateDTU,
  TPostsUpdateBodyDTU,
} from "./../../../types/Companies/posts/posts.type";
import { PrismaClient } from "@prisma/client";
import {
  TJobPositionsDetails,
  TPostsCreateBodyDTU,
} from "../../../types/Companies/posts/posts.type";
import { TParams, TSet } from "../../../types/utils/elysiaCustom.typs";
import { ResFail, ResFail500, ResSucess } from "../../../utils/response";
import { EMessage } from "../../../utils/message";
import { PostsService } from "../../../services/companies/posts/posts.service";
import { PostsFacultysService } from "../../../services/companies/posts/faculty.service";
import { PostsJobPositionsDetailsService } from "../../../services/companies/posts/jobPositionDetails.service";
import { PostsLanguagesService } from "../../../services/companies/posts/language.service";
import { PostsStudyCourseService } from "../../../services/companies/posts/studyCourse.service";
import { FacultyService } from "../../../services/Combo/facultys.service";
import { LanguagesService } from "../../../services/Combo/languages.service";
import { StudyCourseService } from "../../../services/Combo/studyCourse.service";
import { CompaniesService } from "../../../services/companies/companiees.service";
import { DeduplicateArray } from "../../../utils/controArrary";
import {
  converStringToArray,
  converStringToBoolean,
  converStringToFloat,
} from "../../../utils/converData";
import {
  validateElementsExists,
  validateElementsJobPositionDetailsExists,
} from "../../../utils/validate";
import { EducationalInstitutionsService } from "../../../services/Combo/educationInstitustions.service";
import { RemoveImage, UploadImage } from "../../../utils/upload";
import { TPostStudyCourseCreateDTU } from "../../../types/Companies/posts/studyCourse.type";
import { TPostFacultysCreateDTU } from "../../../types/Companies/posts/faculty.types";
import { TPostLanguageCreateDTU } from "../../../types/Companies/posts/language.type";
import {
  CacheDataAdd,
  CacheDataDelete,
  CacheDataUpdate,
} from "../../../utils/cache.control";
import { TPostJobPositionsDetailsCreateDTU } from "../../../types/Companies/posts/jobPositionsDetails.type";

export class PostsController {
  private key: string;
  private model: keyof PrismaClient;
  private pService: PostsService;
  private pFService: PostsFacultysService;
  private pJPDService: PostsJobPositionsDetailsService;
  private pLService: PostsLanguagesService;
  private pSCService: PostsStudyCourseService;
  private fService: FacultyService;
  private lService: LanguagesService;
  private scService: StudyCourseService;
  private cService: CompaniesService;
  private eIService: EducationalInstitutionsService;

  constructor() {
    this.model = "posts";
    this.key = String(this.model);
    this.pService = new PostsService();
    this.pJPDService = new PostsJobPositionsDetailsService();
    this.pFService = new PostsFacultysService();
    this.pLService = new PostsLanguagesService();
    this.pSCService = new PostsStudyCourseService();
    this.fService = new FacultyService();
    this.lService = new LanguagesService();
    this.scService = new StudyCourseService();
    this.cService = new CompaniesService();
    this.eIService = new EducationalInstitutionsService();
  }

  // Create a new post
  async Create({ body, set }: { body: TPostsCreateBodyDTU; set: TSet }) {
    try {
      // Convert strings to arrays and deduplicate
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

      // Convert strings to float
      if (body.gpa) body.gpa = converStringToFloat(body.gpa);
      if (body.startSalary)
        body.startSalary = converStringToFloat(body.startSalary);
      if (body.endSalary) body.endSalary = converStringToFloat(body.endSalary);

      // Check if company exists
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

      // Validate elements existence
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

      // Upload images if any
      let images: string[] = [];
      if (body.images) {
        const promiseList = body.images.map((img) => UploadImage(img));
        images = await Promise.all(promiseList);
      }

      // Create post data
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

      // Create post
      const posts = await this.pService.Create(createData);

      // Prepare data for related entities
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

      // Create related entities
      await Promise.all([
        this.pLService.CreateMany(pLanguageData),
        this.pSCService.CreateMany(pStudyCourseData),
        this.pFService.CreateMany(pFacultysData),
      ]);

      // Prepare job positions details data
      const pJobPositionsDetailsData: TJobPositionsDetails[] =
        AddIdObjectInArrayPosts(posts.id, body.jobpositionsDetails, "jpId");

      // Create job positions details
      await this.pJPDService.CreateMany(pJobPositionsDetailsData);

      // Fetch all data and the newly created data
      const [allData, newData] = await Promise.all([
        this.pService.FindMany(),
        this.pService.FindUnique(posts.id),
      ]);

      // Add new data to cache
      CacheDataAdd(this.key, newData, allData);

      // Return success response
      return ResSucess({
        set,
        statusCode: 201,
        message: `${EMessage.SUCCESS_INSERT} ${this.key}`,
        data: newData,
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
      // Handle other errors
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_INSERT} ${this.key}`,
        error: { error },
      });
    }
  }

  // Update a post
  async Update({
    body,
    set,
    params: { id },
  }: {
    body: TPostsUpdateBodyDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      // Find existing post and company if cId is provided
      let promiseList: any[] = [this.pService.FindOne(id)];
      if (body.cId) promiseList.push(this.cService.FindOne(body.cId));
      const [postsExists, companiesExists] = await Promise.all(promiseList);

      if (!postsExists || (body.cId && !companiesExists))
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !postsExists ? this.key : "companies"
          }`,
          error: `${!postsExists ? "id" : "cId"}`,
        });

      // Convert strings to boolean and float
      if (body.gpa) body.gpa = converStringToFloat(body.gpa);
      if (body.startSalary)
        body.startSalary = converStringToFloat(body.startSalary);
      if (body.endDate && body.endSalary !== undefined)
        body.endSalary = converStringToFloat(body.endSalary);
      if (body.visible) body.visible = converStringToBoolean(body.visible);

      // Update post
      const update = await this.pService.Update(id, body as TPostsUpdaateDTU);

      // Update data in cache
      const [allData, updateData] = await Promise.all([
        this.pService.FindMany(),
        this.pService.FindUnique(id),
      ]);
      CacheDataUpdate(this.key, updateData, allData);

      // Return success response
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_UPDATE} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} ${this.key}`,
        error: { error },
      });
    }
  }

  // Update post image
  async UpdateImage({
    body,
    set,
    params: { id },
  }: {
    body:
      | {
          image?: File;
          oldUrl?: string;
        }
      | undefined;
    set: TSet;
    params: TParams;
  }) {
    try {
      const {
        image,
        oldUrl,
      }: {
        image?: File;
        oldUrl?: string;
      } = { ...body };

      // Check if post exists
      const postsExists = await this.pService.FindOne(id);
      if (!postsExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}  ${this.key}`,
          error: "id",
        });

      // Remove old image if provided
      let arr: string[] = postsExists.images;
      if (oldUrl) {
        await RemoveImage(oldUrl);
        arr = RemoveDataInArray(oldUrl, arr);
      }

      // Upload new image if provided
      if (image) {
        const newUrl = await UploadImage(image);
        arr = AddDataInArray(newUrl, arr);
      }

      // Update post images
      const [allData, updateData] = await Promise.all([
        this.pService.FindMany(),
        this.pService.Update(id, { images: arr }),
      ]);
      await CacheDataUpdate(this.key, updateData, allData);

      // Return success response
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_UPDATE} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} ${this.key}`,
        error: { error },
      });
    }
  }

  // Delete a post
  async Delete({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      // Check if post exists
      const postsExists = await this.pService.FindOne(id);
      if (!postsExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}  ${this.key}`,
          error: "id",
        });

      // Delete post and update cache
      const [allData, deleteData] = await Promise.all([
        this.pService.FindMany(),
        this.pService.Delete(id),
      ]);
      CacheDataDelete(this.key, id, allData);

      // Return success response
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_FETCH_ONE} ${this.key}`,
        data: postsExists,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_DELETE} ${this.key}`,
        error: { error },
      });
    }
  }

  // Find many posts
  async FindMany({ set }: { set: TSet }) {
    try {
      // Fetch all posts
      const result = await this.pService.FindMany();

      // Return success response
      return ResSucess({
        set,
        statusCode: 200,
        message: `${EMessage.SUCCESS_FETCH_ALL} ${this.key}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} ${this.key}`,
        error: { error },
      });
    }
  }

  // Select one post by ID
  async SelectOne({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      // Fetch post by ID
      const result = await this.pService.FindOne(id);
      if (!result)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}  ${this.key}`,
          error: "id",
        });

      // Return success response
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
