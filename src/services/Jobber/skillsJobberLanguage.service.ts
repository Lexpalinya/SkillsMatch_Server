import { PrismaClient } from "@prisma/client";
import prisma from "../../DB/prismaClient";
import {
  TSkillsJobberLanguageCreateDTU,
  TSkillsJobberLanguageDTU,
  TSkillssJobberLanguageUpdateDTU,
} from "../../types/Jobber/skillsJobberLanguage.type";
import { CacheData, RemoveCache } from "../../utils/cache.control";

export class SkillsJobberLanguageService {
  private prisma: PrismaClient;
  private keys: string;
  private model: keyof PrismaClient;
  constructor() {
    this.model = "skillJobberLanguage";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TSkillsJobberLanguageCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.skillJobberLanguage.create({ data });
  }
  async CreateMany(data: TSkillsJobberLanguageCreateDTU[]) {
    await RemoveCache(this.keys);
    return this.prisma.skillJobberLanguage.createMany({ data });
  }

  async Update(id: number, data: TSkillssJobberLanguageUpdateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.skillJobberLanguage.update({ where: { id }, data });
  }

  async Delete(id: number) {
    await RemoveCache(this.keys);
    return this.prisma.skillJobberLanguage.delete({ where: { id } });
  }
  async FindMany() {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
  }

  async FindOne(id: number): Promise<TSkillsJobberLanguageDTU | undefined> {
    const result: TSkillsJobberLanguageDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }
  async FindAlready({ lId, sjId }: { lId: string; sjId: string }) {
    const result: TSkillsJobberLanguageDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.sjId === sjId && item.lId === lId);
  }
}
