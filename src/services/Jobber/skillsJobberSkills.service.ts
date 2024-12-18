import { PrismaClient } from "@prisma/client";
import prisma from "../../DB/prismaClient";
import {
  TSkillsJobberSkillsCreateDTU,
  TSkillsJobberSkillsDTU,
  TSkillsJobberSkillsUpdateDTU,
} from "../../types/Jobber/skillsJobberSkills.type";
import { CacheData } from "../../utils/cache.control";

export class SkillsJobberSkillService {
  private prisma: PrismaClient;
  private keys: string;
  private model: keyof PrismaClient;

  constructor() {
    this.model = "skillJobberSkills";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TSkillsJobberSkillsCreateDTU) {
    return this.prisma.skillJobberSkills.create({ data });
  }
  async CreateMany(data: TSkillsJobberSkillsCreateDTU[]) {
    return this.prisma.skillJobberSkills.createMany({ data });
  }

  async Update(id: number, data: TSkillsJobberSkillsUpdateDTU) {
    return this.prisma.skillJobberSkills.update({ where: { id }, data });
  }

  async Delete(id: number) {
    return this.prisma.skillJobberSkills.delete({ where: { id } });
  }
  async FindMany() {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
  }
  async FindOne(id: number): Promise<TSkillsJobberSkillsDTU | undefined> {
    const result: TSkillsJobberSkillsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }
  async FindAlready({ sId, sjId }: { sId: string; sjId: string }) {
    const result: TSkillsJobberSkillsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.sjId === sjId && item.sId === sId);
  }
}
