import prisma from "../../DB/prismaClient";
import { Companies, PrismaClient } from "@prisma/client";

import {
  CacheData,
  CacheDataFindByIdNotIsActive,
  CacheDataSearchNotIsActive,
} from "../../utils/cache.control";
import {
  TCompaniesCreateUTD,
  TCompaniesUpdateUTD,
} from "../../types/Companies/companies.type";

export class CompaniesService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;
  private baseInclude = {
    businessModel: {
      select: { id: true, name: true, visible: true, isActive: true },
    },
    typeOrganinzations: {
      select: { id: true, name: true, visible: true, isActive: true },
    },
    users: {
      select: { profile: true },
    },
  };

  constructor() {
    this.prisma = prisma;
    this.model = "companies";
    this.keys = String(this.model);
  }

  async Create(data: TCompaniesCreateUTD): Promise<Companies> {
    return this.prisma.companies.create({
      data,
      include: this.baseInclude,
    });
  }

  async Update(
    id: string,
    updateData: TCompaniesUpdateUTD
  ): Promise<Companies> {
    return this.prisma.companies.update({
      where: { id },
      data: updateData,
      include: this.baseInclude,
    });
  }

  async FindMany(): Promise<Companies[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      include: this.baseInclude,
    });
  }
  async FindOne(id: string): Promise<Companies | null> {
    return CacheDataFindByIdNotIsActive({
      key: this.keys,
      model: this.model,
      where: {
        id: id,
      },
      include: this.baseInclude,
    });
  }
  async FindUserIdExists(id: string) {
    return CacheDataSearchNotIsActive({
      key: this.keys,
      model: this.model,
      where: { userId: id },
      search: "userId",
      include: this.baseInclude,
    });
  }
}
