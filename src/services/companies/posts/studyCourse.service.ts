import { PrismaClient } from "@prisma/client";
import {
  TPostStudyCouresDTU,
  TPostStudyCourseCreateDTU,
  TPostStudyCourseUpdateDTU,
} from "../../../types/Companies/posts/studyCourse.type";
import { CacheData, RemoveCache } from "../../../utils/cache.control";
import prisma from "../../../DB/prismaClient";

export class PostsStudyCourseService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;

  constructor() {
    this.model = "postStudyCourse";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TPostStudyCourseCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postStudyCourse.create({ data });
  }
  async CreateMany(data: TPostStudyCourseCreateDTU[]) {
    await RemoveCache(this.keys);
    return this.prisma.postStudyCourse.createMany({ data });
  }
  async Update(id: number, data: TPostStudyCourseUpdateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postStudyCourse.update({ where: { id }, data });
  }
  async Delete(id: number) {
    await RemoveCache(this.keys);
    return this.prisma.postStudyCourse.delete({ where: { id } });
  }
  async FindMany(): Promise<TPostStudyCouresDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }

  async FindOne(id: number) {
    const result: TPostStudyCouresDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }

  async FindAlready({ pId, scId }: TPostStudyCourseCreateDTU) {
    const result: TPostStudyCouresDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.pId === pId && item.scId === scId);
  }
}
