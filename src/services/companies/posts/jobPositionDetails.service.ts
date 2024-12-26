import {
  TPostJobPositionsDetailsCreateDTU,
  TPostJobPositionsDetailsDTU,
  TPostJobPositionsDetailsUpdateDTU,
} from "./../../../types/Companies/posts/jobPositionsDetails.type";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../DB/prismaClient";
import { CacheData, RemoveCache } from "../../../utils/cache.control";

export class PostsJobPositionsDetailsService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;

  constructor() {
    this.model = "postJobPositionsDetails";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TPostJobPositionsDetailsCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postJobPositionsDetails.create({ data });
  }
  async CreateMany(data: TPostJobPositionsDetailsCreateDTU[]) {
    await RemoveCache(this.keys);
    return this.prisma.postJobPositionsDetails.createMany({ data });
  }
  async Update(id: number, data: TPostJobPositionsDetailsUpdateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postJobPositionsDetails.update({ where: { id }, data });
  }
  async Delete(id: number) {
    await RemoveCache(this.keys);
    return this.prisma.postJobPositionsDetails.delete({ where: { id } });
  }
  async FindMany(): Promise<TPostJobPositionsDetailsDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }

  async FindOne(id: number) {
    const result: TPostJobPositionsDetailsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }

  async FindAlready({ pId, jpId }: TPostJobPositionsDetailsCreateDTU) {
    const result: TPostJobPositionsDetailsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.pId === pId && item.jpId === jpId);
  }
}
