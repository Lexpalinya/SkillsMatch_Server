import { PrismaClient } from "@prisma/client";
import {
  TAboutCompanyCreateDTU,
  TAboutCompanyDTU,
  TAboutCompanyUpdateDTU,
} from "../../types/Companies/aboutCompany.type";
import prisma from "../../DB/prismaClient";
import {
  CacheData,
  CacheDataFilter,
  CacheDataFindByIdNotIsActive,
} from "../../utils/cache.control";

export class AboutCompanyService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
    this.model = "aboutCompany";
    this.keys = String(this.model);
  }
  async Create(data: TAboutCompanyCreateDTU) {
    return this.prisma.aboutCompany.create({ data });
  }

  async Update(id: string, updateData: TAboutCompanyUpdateDTU) {
    return this.prisma.aboutCompany.update({ where: { id }, data: updateData });
  }

  async Delete(id: string) {
    return this.prisma.aboutCompany.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async FindMany(): Promise<TAboutCompanyDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }
  async FindOne(id: string): Promise<TAboutCompanyDTU | null> {
    return CacheDataFindByIdNotIsActive({
      key: this.keys,
      model: this.model,
      where: {
        id: id,
      },
    });
  }

  async FindFilterCompaniesId(id: string) {
    return CacheDataFilter({
      key: this.keys,
      model: this.model,
      where: { cId: id },
      search: "cId",
    });
  }
}
