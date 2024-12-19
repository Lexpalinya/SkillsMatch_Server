import { PrismaClient } from "@prisma/client";
import prisma from "../../../DB/prismaClient";
import {
  TPostJobPositionDetailsSkillsCreateDTU,
  TPostJobPositionDetailsSkillsDTU,
  TPostJobPositionDetailsSkillsUpdateDTU,
} from "../../../types/Companies/posts/jobPositionDetailsSkills.type";
import { CacheData, RemoveCache } from "../../../utils/cache.control";

export class PostsJobPositionDetailsSkillsService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;

  constructor() {
    this.model = "postJobPositionsDetailsSkills";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TPostJobPositionDetailsSkillsCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postJobPositionsDetailsSkills.create({ data });
  }
  async CreateMany(data: TPostJobPositionDetailsSkillsCreateDTU[]) {
    await RemoveCache(this.keys);
    return this.prisma.postJobPositionsDetailsSkills.createMany({ data });
  }
  async Update(id: number, data: TPostJobPositionDetailsSkillsUpdateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postJobPositionsDetailsSkills.update({
      where: { id },
      data,
    });
  }
  async Delete(id: number) {
    await RemoveCache(this.keys);
    return this.prisma.postJobPositionsDetailsSkills.delete({ where: { id } });
  }
  async FindMany(): Promise<TPostJobPositionDetailsSkillsDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }

  async FindOne(id: number) {
    const result: TPostJobPositionDetailsSkillsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }

  async FindAlready({ pjpId, sId }: TPostJobPositionDetailsSkillsCreateDTU) {
    const result: TPostJobPositionDetailsSkillsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.pjpId === pjpId && item.sId === sId);
  }
}
