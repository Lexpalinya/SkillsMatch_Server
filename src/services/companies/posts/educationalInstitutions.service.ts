import { PrismaClient } from "@prisma/client";
import prisma from "../../../DB/prismaClient";

import { CacheData, RemoveCache } from "../../../utils/cache.control";
import {
  TPostEducationalInstitutionsCreateDTU,
  TPostEducationalInstitutionsDTU,
  TPostEducationalInstitutionsUpdateDTU,
} from "../../../types/Companies/posts/educationalInstitutions.type";

export class PostsEductionalInstitutionsService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;

  constructor() {
    this.model = "postEducationalInstitutions";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TPostEducationalInstitutionsCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postEducationalInstitutions.create({ data });
  }
  async CreateMany(data: TPostEducationalInstitutionsCreateDTU[]) {
    await RemoveCache(this.keys);
    return this.prisma.postEducationalInstitutions.createMany({ data });
  }
  async Update(id: number, data: TPostEducationalInstitutionsUpdateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postEducationalInstitutions.update({
      where: { id },
      data,
    });
  }
  async Delete(id: number) {
    await RemoveCache(this.keys);
    return this.prisma.postEducationalInstitutions.delete({ where: { id } });
  }
  async FindMany(): Promise<TPostEducationalInstitutionsDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }

  async FindOne(id: number) {
    const result: TPostEducationalInstitutionsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }

  async FindAlready({ pId, eiId }: TPostEducationalInstitutionsCreateDTU) {
    const result: TPostEducationalInstitutionsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.pId === pId && item.eiId === eiId);
  }
}
