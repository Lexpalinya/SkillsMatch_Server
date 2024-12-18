import { PrismaClient } from "@prisma/client";
import { CompaniesService } from "../../services/companies/companiees.service";
import { AboutCompanyService } from "../../services/companies/aboutCompany.service";
import {
  TAboutCompanyCreateBodyDTU,
  TAboutCompanyCreateDTU,
  TAboutCompanyUpdateDTU,
} from "../../types/Companies/aboutCompany.type";
import { TParams, TSet } from "../../types/utils/elysiaCustom.typs";
import { ResFail, ResFail500, ResSucess } from "../../utils/response";
import { EMessage } from "../../utils/message";
import { RemoveImage, UploadImage } from "../../utils/upload";
import { converStringToBoolean } from "../../utils/converData";
import {
  CacheDataAdd,
  CacheDataDelete,
  CacheDataUpdate,
} from "../../utils/cache.control";
import { AddDataInArray, RemoveDataInArray } from "../../utils/controArrary";

export class AboutCompanyController {
  private key: string;
  private model: keyof PrismaClient;
  private companiesService: CompaniesService;
  private aboutCompanyService: AboutCompanyService;
  constructor() {
    this.model = "aboutCompany";
    this.key = String(this.model);
    this.companiesService = new CompaniesService();
    this.aboutCompanyService = new AboutCompanyService();
  }

  async Create({ body, set }: { body: TAboutCompanyCreateBodyDTU; set: TSet }) {
    try {
      const [companiesExists] = await Promise.all([
        this.companiesService.FindOne(body.cId),
      ]);

      if (!companiesExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} companies`,
          error: "id",
        });
      const promiseList = body.images.map((img) => UploadImage(img));
      const images = await Promise.all(promiseList);
      body.visible = converStringToBoolean(body.visible);
      const createData: TAboutCompanyCreateDTU = {
        ...body,
        images,
      };
      const [allData, newData] = await Promise.all([
        this.aboutCompanyService.FindMany(),
        this.aboutCompanyService.Create(createData),
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
    body: TAboutCompanyUpdateDTU;
    set: TSet;
    params: TParams;
  }) {
    try {
      if (body.visible) body.visible = converStringToBoolean(body.visible);
      const promiseList: any[] = [this.aboutCompanyService.FindOne(id)];
      if (body.cId) promiseList.push(this.companiesService.FindOne(body.cId));
      const [aboutCompanyExists, companiesExists] = await Promise.all(
        promiseList
      );

      if (!aboutCompanyExists || (body.cId && !companiesExists))
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${
            !aboutCompanyExists ? this.key : "companies"
          }`,
          error: `${!aboutCompanyExists ? "id" : "cId"}`,
        });

      const [allData, updateData] = await Promise.all([
        this.aboutCompanyService.FindMany(),
        this.aboutCompanyService.Update(id, body),
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
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} ${this.key}`,
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
      const aboutCompanyExists = await this.aboutCompanyService.FindOne(id);
      if (!aboutCompanyExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key} `,
          error: ` "id"`,
        });
      let arr: string[] = aboutCompanyExists.images;
      if (oldUrl) {
        await RemoveImage(oldUrl);
        arr = RemoveDataInArray(oldUrl, arr);
      }
      if (image) {
        const newUrl = await UploadImage(image);
        arr = AddDataInArray(newUrl, arr);
      }
      const [allData, updateData] = await Promise.all([
        this.aboutCompanyService.FindMany(),
        this.aboutCompanyService.Update(id, { images: arr }),
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

  async Delete({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      const aboutCompanyExists = await this.aboutCompanyService.FindOne(id);
      if (!aboutCompanyExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}${this.key} `,
          error: ` "id"`,
        });

      const [allData, deleteData] = await Promise.all([
        this.aboutCompanyService.FindMany(),
        this.aboutCompanyService.Delete(id),
      ]);

      await CacheDataDelete(this.key, id, allData);
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_DELETE} ${this.key}`,
        data: deleteData,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_DELETE} ${this.key} `,
        error: { error },
      });
    }
  }

  async SelectAll({ set }: { set: TSet }) {
    try {
      const result = await this.aboutCompanyService.FindMany();
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ALL} ${this.key}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} ${this.key} `,
        error: { error },
      });
    }
  }
  async SelectOne({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      const result = await this.aboutCompanyService.FindOne(id);
      if (!result)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}${this.key} `,
          error: ` "id"`,
        });
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} ${this.key}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE} ${this.key} `,
        error: { error },
      });
    }
  }

  async SelectByCompanyId({
    set,
    params: { id },
  }: {
    set: TSet;
    params: TParams;
  }) {
    try {
      const result = await this.aboutCompanyService.FindFilterCompaniesId(id);
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} ${this.key}`,
        data: result,
      });
    } catch (error) {
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE} ${this.key} `,
        error: { error },
      });
    }
  }
}
