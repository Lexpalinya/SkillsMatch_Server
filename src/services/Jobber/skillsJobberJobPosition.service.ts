import { PrismaClient } from "@prisma/client";
import prisma from "../../DB/prismaClient";
import {
  TSkillsJobberJobPositionsCreateDTU,
  TSkillsJobberJobPositionsDTU,
} from "../../types/Jobber/skillsJobberJobPositions.type";
import { CacheData, RemoveCache } from "../../utils/cache.control";

export class SkillsJobberJobPositionsService {
  private prisma: PrismaClient;
  private keys: string;
  private model: keyof PrismaClient;
  constructor() {
    this.model = "skillJobberJobPositions";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TSkillsJobberJobPositionsCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.skillJobberJobPositions.create({
      data,
    });
  }
  async CreateMany(data: TSkillsJobberJobPositionsCreateDTU[]) {
    await RemoveCache(this.keys);
    return this.prisma.skillJobberJobPositions.createMany({ data });
  }

  async Update(id: number, data: TSkillsJobberJobPositionsCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.skillJobberJobPositions.update({ where: { id }, data });
  }

  async Delete(id: number) {
    await RemoveCache(this.keys);
    return this.prisma.skillJobberJobPositions.delete({ where: { id } });
  }

  async FindMany(): Promise<TSkillsJobberJobPositionsDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
  }
  async FindOne(id: number): Promise<TSkillsJobberJobPositionsDTU | undefined> {
    const result: TSkillsJobberJobPositionsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }
  async FindAlready({ jpId, sjId }: { jpId: string; sjId: string }) {
    const result: TSkillsJobberJobPositionsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.jpId === jpId && item.sjId === sjId);
  }
}
