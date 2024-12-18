import { PrismaClient } from "@prisma/client";
import prisma from "../../DB/prismaClient";
import {
  CacheData,
  CacheDataFilter,
  CacheDataFindById,
  CacheDataSearch,
} from "../../utils/cache.control";
import {
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class CreateModelHandlerService<T> {
  private prisma: PrismaClient;
  private model: keyof PrismaClient;

  constructor(model: keyof PrismaClient) {
    this.prisma = prisma;
    this.model = model;
  }

  private getModelInstance() {
    const modelKey = String(this.model);
    if (!(modelKey in this.prisma)) {
      throw new Error(`Model "${modelKey}" does not exist in Prisma Client.`);
    }
    return this.prisma[this.model] as any;
  }

  async Create(data: TmodelHandlerCreate): Promise<T> {
    const modelInstance = this.getModelInstance();
    return modelInstance.create({ data });
  }

  async Update(where: any, data: TmodelHandlerUpdate): Promise<T> {
    const modelInstance = this.getModelInstance();
    return modelInstance.update({ where, data });
  }

  async Delete(where: any): Promise<T> {
    const modelInstance = this.getModelInstance();
    return modelInstance.update({
      where,
      data: {
        isActive: false,
      },
    });
  }

  async FindMany(): Promise<T[]> {
    const modelKey = String(this.model);
    return CacheData({
      key: modelKey,
      model: this.model,
    });
  }

  async FindOne(id: string): Promise<T | null> {
    const modelKey = String(this.model);
    return CacheDataFindById({
      key: modelKey,
      model: this.model,
      where: {
        id,
      },
    });
  }
  async FindSearch(search: string, where: {}): Promise<T[] | null> {
    const modelKey = String(this.model);
   
    return CacheDataSearch({
      key: modelKey,
      model: this.model,
      where: {
        isActive: true,
        ...where,
      },
      search,
    });
  }
  async FindFilter(search: string, where: {}): Promise<T[] | null> {
    const modelKey = String(this.model);
    return CacheDataFilter({
      key: modelKey,
      model: this.model,
      where: {
        isActive: true,
        ...where,
      },
      search,
    });
  }
}
