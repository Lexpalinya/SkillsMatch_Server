import { TCompaniesUpdateUTD } from "../../types/Companies/companies.type";
import { PrismaClient } from "@prisma/client";
import { BusinessModelsService } from "../../services/Combo/businessModels.service";
import { CompaniesService } from "../../services/companies/companiees.service";
import { UserService } from "../../services/user.service";
import {
  TCompaniesCreateBobyUTD,
  TCompaniesCreateUTD,
} from "../../types/Companies/companies.type";
import {
  TParams,
  TQueryUserId,
  TSet,
} from "../../types/utils/elysiaCustom.typs";
import { ResFail, ResFail500, ResSucess } from "../../utils/response";
import { EMessage } from "../../utils/message";
import { RemoveImage, UploadImage } from "../../utils/upload";
import { CacheDataAdd, CacheDataUpdate } from "../../utils/cache.control";
import { ValidateLengthBody } from "../../utils/validate";
import { converStringToBoolean } from "../../utils/converData";
import { AddDataInArray, RemoveDataInArray } from "../../utils/controArrary";
import { TypeOrganinzationsService } from "../../services/Combo/typeOrganinzations.service";

export class CompaniesController {
  private companiesService: CompaniesService;
  private userUserService: UserService;
  private businessModelsService: BusinessModelsService;
  private typeOrganinzations: TypeOrganinzationsService;
  private model: keyof PrismaClient;
  private key: string;
  constructor() {
    this.companiesService = new CompaniesService();
    this.userUserService = new UserService();
    this.businessModelsService = new BusinessModelsService();
    this.typeOrganinzations = new TypeOrganinzationsService();
    this.model = "companies";
    this.key = String(this.model);
  }

  async Create({
    body,
    set,
    query,
  }: {
    body: TCompaniesCreateBobyUTD;
    set: TSet;
    query: TQueryUserId;
  }) {
    try {
      const userId = query?.userId || set.user!.id;

      const [
        userExists,
        businessModelsExists,
        companiesUserIdExists,
        typeOrganizationsExists,
      ] = await Promise.all([
        this.userUserService.findOne(userId),
        this.businessModelsService.FindOne(body.bmId),
        this.companiesService.FindUserIdExists(userId),
        this.typeOrganinzations.FindOne(body.toId),
      ]);
      if (companiesUserIdExists) {
        return ResFail({
          set,
          message: `${EMessage.ERROR_USER_EXISTS} ${this.key}`,
          error: "userId",
        });
      }
      if (!userExists || !businessModelsExists || !typeOrganizationsExists) {
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !userExists
              ? "user"
              : !businessModelsExists
              ? "businessModels"
              : "typeOrganizations"
          }`,
          error: `${
            !userExists ? "userId" : !businessModelsExists ? "bmId" : "toId"
          }`,
        });
      }
      const promiseList = body.docImage.map((img) => UploadImage(img));
      const docImage = await Promise.all(promiseList);
      const createData: TCompaniesCreateUTD = {
        ...body,
        userId,
        docImage,
      };

      const [allData, newData] = await Promise.all([
        this.companiesService.FindMany(),
        this.companiesService.Create(createData),
      ]);
      await CacheDataAdd(this.key, newData, allData);
      return ResSucess({
        set,
        statusCode: 201,
        message: `${EMessage.SUCCESS_INSERT} ${this.key}`,
        data: newData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_INSERT} ${this.key}`,
        error: { error },
      });
    }
  }

  async Update({
    body,
    set,
    params: { id },
  }: {
    body: TCompaniesUpdateUTD;
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
      let promiseList: any = [this.companiesService.FindOne(id)];
      if (body.bmId)
        promiseList.push(this.businessModelsService.FindOne(body.bmId));
      if (body.toId)
        promiseList.push(this.typeOrganinzations.FindOne(body.toId!));
      const result = await Promise.all(promiseList);
      let companiesExists = result.shift(),
        businessModelsExists,
        typeOrganizationsExists;
      if (body.bmId) businessModelsExists = result.shift();
      if (body.toId) typeOrganizationsExists = result.shift();
      if (
        !companiesExists ||
        (body.bmId && !businessModelsExists) ||
        (body.toId && !typeOrganizationsExists)
      )
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !companiesExists
              ? this.key
              : body.bmId && !businessModelsExists
              ? "businessModels"
              : "typeOrganinzations"
          }`,
          error: ` ${
            !companiesExists
              ? "id"
              : body.bmId && !businessModelsExists
              ? "bmId"
              : "toId"
          }`,
        });

      const [allData, updateData] = await Promise.all([
        this.companiesService.FindMany(),
        this.companiesService.Update(id, body),
      ]);
      await CacheDataUpdate(this.key, updateData, allData);

      return ResSucess({
        set,
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

      const companiesExists = await this.companiesService.FindOne(id);
      if (!companiesExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key}`,
          error: "id",
        });

      let arr = companiesExists.docImage;
      if (oldUrl) {
        await RemoveImage(oldUrl);
        arr = RemoveDataInArray(oldUrl, arr);
      }
      if (docImage) {
        //add img
        const newUrl = await UploadImage(docImage);
        arr = AddDataInArray(newUrl, arr);
      }
      const [allData, updateData] = await Promise.all([
        this.companiesService.FindMany(),
        this.companiesService.Update(id, { docImage: arr }),
      ]);
      await CacheDataUpdate(this.key, updateData, allData);

      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_UPDATE} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} ${this.key}`,
        error: { error },
      });
    }
  }
  async SelectAll({ set }: { set: TSet }) {
    try {
      const result = await this.companiesService.FindMany();
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} Jobber`,
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
  async SelectOne({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      const result = await this.companiesService.FindOne(id);
      if (!result)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key}`,
          error: "id",
        });
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} ${this.key}`,
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
}
