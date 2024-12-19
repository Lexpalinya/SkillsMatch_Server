import { PrismaClient } from "@prisma/client";
import { CacheData, RemoveCache } from "../../../utils/cache.control";
import prisma from "../../../DB/prismaClient";
import {
  TPostLanguageCreateDTU,
  TPostLanguageDTU,
  TPostLanguageUpdateDTU,
} from "../../../types/Companies/posts/language.type";

export class PostsLanguagesService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;

  constructor() {
    this.model = "postLanguage";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TPostLanguageCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postLanguage.create({ data });
  }
  async CreateMany(data: TPostLanguageCreateDTU[]) {
    await RemoveCache(this.keys);
    return this.prisma.postLanguage.createMany({ data });
  }
  async Update(id: number, data: TPostLanguageUpdateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postLanguage.update({ where: { id }, data });
  }
  async Delete(id: number) {
    await RemoveCache(this.keys);
    return this.prisma.postLanguage.delete({ where: { id } });
  }
  async FindMany(): Promise<TPostLanguageDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }

  async FindOne(id: number) {
    const result: TPostLanguageDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }

  async FindAlready({ pId, lId }: TPostLanguageCreateDTU) {
    const result: TPostLanguageDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.pId === pId && item.lId === lId);
  }
}
