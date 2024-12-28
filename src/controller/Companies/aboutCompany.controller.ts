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

  // Create a new about company entry
  async Create({ body, set }: { body: TAboutCompanyCreateBodyDTU; set: TSet }) {
    try {
      // Check if company exists
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

      // Upload images
      const promiseList = body.images.map((img) => UploadImage(img));
      const images = await Promise.all(promiseList);

      // Convert visible field to boolean
      body.visible = converStringToBoolean(body.visible);

      // Prepare data for creation
      const createData: TAboutCompanyCreateDTU = {
        ...body,
        images,
      };

      // Create about company entry and fetch all data
      const [allData, newData] = await Promise.all([
        this.aboutCompanyService.FindMany(),
        this.aboutCompanyService.Create(createData),
      ]);

      // Add new data to cache
      await CacheDataAdd(this.key, newData, allData);

      // Return success response
      return ResSucess({
        set,
        statusCode: 201,
        message: `${EMessage.SUCCESS_INSERT} ${this.key}`,
        data: newData,
      });
    } catch (error) {
      // Handle errors
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_INSERT} ${this.key}`,
        error: { error },
      });
    }
  }

  // Update an existing about company entry
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
      // Convert visible field to boolean if provided
      if (body.visible) body.visible = converStringToBoolean(body.visible);

      // Check if about company entry and company exist
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

      // Update about company entry and fetch all data
      const [allData, updateData] = await Promise.all([
        this.aboutCompanyService.FindMany(),
        this.aboutCompanyService.Update(id, body),
      ]);

      // Update cache with new data
      await CacheDataUpdate(this.key, updateData, allData);

      // Return success response
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_UPDATE} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      // Handle errors
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_UPDATE} ${this.key}`,
        error: { error },
      });
    }
  }

  // Update image of an about company entry
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

      // Check if about company entry exists
      const aboutCompanyExists = await this.aboutCompanyService.FindOne(id);
      if (!aboutCompanyExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND} ${this.key} `,
          error: ` "id"`,
        });

      // Remove old image if provided
      let arr: string[] = aboutCompanyExists.images;
      if (oldUrl) {
        await RemoveImage(oldUrl);
        arr = RemoveDataInArray(oldUrl, arr);
      }

      // Upload new image if provided
      if (image) {
        const newUrl = await UploadImage(image);
        arr = AddDataInArray(newUrl, arr);
      }

      // Update about company entry with new images and fetch all data
      const [allData, updateData] = await Promise.all([
        this.aboutCompanyService.FindMany(),
        this.aboutCompanyService.Update(id, { images: arr }),
      ]);

      // Update cache with new data
      await CacheDataUpdate(this.key, updateData, allData);

      // Return success response
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_UPDATE} ${this.key}`,
        data: updateData,
      });
    } catch (error) {
      // Handle errors
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} ${this.key}`,
        error: { error },
      });
    }
  }

  // Delete an about company entry
  async Delete({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      // Check if about company entry exists
      const aboutCompanyExists = await this.aboutCompanyService.FindOne(id);
      if (!aboutCompanyExists)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}${this.key} `,
          error: ` "id"`,
        });

      // Delete about company entry and fetch all data
      const [allData, deleteData] = await Promise.all([
        this.aboutCompanyService.FindMany(),
        this.aboutCompanyService.Delete(id),
      ]);

      // Update cache with remaining data
      await CacheDataDelete(this.key, id, allData);

      // Return success response
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_DELETE} ${this.key}`,
        data: deleteData,
      });
    } catch (error) {
      // Handle errors
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_DELETE} ${this.key} `,
        error: { error },
      });
    }
  }

  // Fetch all about company entries
  async SelectAll({ set }: { set: TSet }) {
    try {
      // Fetch all about company entries
      const result = await this.aboutCompanyService.FindMany();

      // Return success response
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ALL} ${this.key}`,
        data: result,
      });
    } catch (error) {
      // Handle errors
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ALL} ${this.key} `,
        error: { error },
      });
    }
  }

  // Fetch a single about company entry by ID
  async SelectOne({ set, params: { id } }: { set: TSet; params: TParams }) {
    try {
      // Fetch about company entry by ID
      const result = await this.aboutCompanyService.FindOne(id);
      if (!result)
        return ResFail({
          set,
          statusCode: 404,
          message: `${EMessage.ERROR_NOT_FOUND}${this.key} `,
          error: ` "id"`,
        });

      // Return success response
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} ${this.key}`,
        data: result,
      });
    } catch (error) {
      // Handle errors
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE} ${this.key} `,
        error: { error },
      });
    }
  }

  // Fetch about company entries by company ID
  async SelectByCompanyId({
    set,
    params: { id },
  }: {
    set: TSet;
    params: TParams;
  }) {
    try {
      // Fetch about company entries by company ID
      const result = await this.aboutCompanyService.FindFilterCompaniesId(id);

      // Return success response
      return ResSucess({
        set,
        message: `${EMessage.SUCCESS_FETCH_ONE} ${this.key}`,
        data: result,
      });
    } catch (error) {
      // Handle errors
      return ResFail500({
        set,
        message: `${EMessage.SERVER_ERROR} ${EMessage.ERROR_FETCH_ONE} ${this.key} `,
        error: { error },
      });
    }
  }
}