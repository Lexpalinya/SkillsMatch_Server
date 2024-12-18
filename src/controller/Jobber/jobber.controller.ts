import { JobberService } from "../../services/Jobber/jobber.service";
import { UserService } from "../../services/user.service";
import {
  TCreateJobberBodyDTO,
  TCreateJobberDTO,
  TUpdateJobberDTO,
} from "../../types/Jobber/jobber.type";
import {
  TParams,
  TQueryUserId,
  TSet,
} from "../../types/utils/elysiaCustom.typs";
import { EMessage } from "../../utils/message";
import { ResFail, ResFail500, ResSucess } from "../../utils/response";
import { RemoveImage, UploadImage } from "../../utils/upload";
import { CacheDataAdd, CacheDataUpdate } from "../../utils/cache.control";
import { PrismaClient } from "@prisma/client";
import { ValidateLengthBody } from "../../utils/validate";
import { converStringToBoolean } from "../../utils/converData";
import { AddDataInArray, RemoveDataInArray } from "../../utils/controArrary";

export class JobberController {
  private jobberService: JobberService;
  private userService: UserService;
  private key: string;
  private model: keyof PrismaClient;
  constructor() {
    this.jobberService = new JobberService();
    this.userService = new UserService();
    this.model = "jobber";
    this.key = String(this.model);
  }

  async Create({
    body,
    set,
    query,
  }: {
    body: TCreateJobberBodyDTO;
    set: TSet;
    query: TQueryUserId;
  }) {
    try {
      const userId = query?.userId || set.user!.id;

      const [userExists, jobberUserIdExists] = await Promise.all([
        this.userService.findOne(userId),
        this.jobberService.FindUserIdExists(userId),
      ]);
      if (jobberUserIdExists) {
        return ResFail({
          set,
          message: `${EMessage.ERROR_USER_EXISTS} jobber`,
          error: "userId",
        });
      }
      if (!userExists) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} user`,
          error: "userId",
        });
      }
      const promiseList = body.docImage.map((img) => UploadImage(img));
      const docImage = await Promise.all(promiseList);
      const createData: TCreateJobberDTO = {
        ...body,
        userId,
        docImage,
      };
      const [allData, newData] = await Promise.all([
        this.jobberService.FindMany(),
        this.jobberService.Create(createData),
      ]);
      await CacheDataAdd(this.key, newData, allData);
      return ResSucess({
        set,
        statusCode: 201,
        message: `${EMessage.SUCCESS_INSERT} Jobber`,
        data: newData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_INSERT} Jobber`,
        error: { error },
      });
    }
  }

  async Update({
    body,
    set,
    params: { id },
  }: {
    body: TUpdateJobberDTO;
    set: TSet;
    params: TParams;
  }) {
    try {
      if (ValidateLengthBody(body))
        return ResFail({
          set,
          message: `${EMessage.INPUT_REQUIRED}`,
        });
      if (body.isVerify) body.isVerify = converStringToBoolean(body.isVerify);
      const jobberExist = await this.jobberService.FindOne(id);
      if (!jobberExist)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} Jobber`,
          error: "id",
        });

      const [allData, updateData] = await Promise.all([
        this.jobberService.FindMany(),
        this.jobberService.Update(id, body),
      ]);

      await CacheDataUpdate(this.key, updateData, allData);
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_UPDATE} Jobber`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} Jobber`,
        error: { error },
      });
    }
  }

  async SelectOne({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      const result = await this.jobberService.FindOne(id);
      if (!result)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} Jobber`,
          error: "id",
        });
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} Jobber`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE} Jobber`,
        error: { error },
      });
    }
  }
  async SelectAll({ set }: { set: TSet }) {
    try {
      const result = await this.jobberService.FindMany();
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} Jobber`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} Jobber`,
        error: { error },
      });
    }
  }

  async UpdateDocImage({
    body,
    set,
    params: { id },
  }: {
    body:
      | {
          docImage?: File;
          oldUrl?: string;
        }
      | undefined;
    set: TSet;
    params: TParams;
  }) {
    try {
      const {
        docImage,
        oldUrl,
      }: {
        docImage?: File;
        oldUrl?: string;
      } = { ...body };
      const jobberExist = await this.jobberService.FindOne(id);
      if (!jobberExist)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} Jobber`,
          error: "id",
        });
      let arr = jobberExist.docImage;
      if (oldUrl) {
        // remove img
        await RemoveImage(oldUrl);
        arr = RemoveDataInArray(oldUrl, arr);
      }

      if (docImage) {
        //add img
        const newUrl = await UploadImage(docImage);
        arr = AddDataInArray(newUrl, arr);
      }

      const [allData, updateData] = await Promise.all([
        this.jobberService.FindMany(),
        this.jobberService.Update(id, { docImage: arr }),
      ]);
      await CacheDataUpdate(this.key, updateData, allData);

      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_UPDATE} Jobber`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} Jobber`,
        error: { error },
      });
    }
  }
}
