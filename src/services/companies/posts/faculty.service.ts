import { PrismaClient } from "@prisma/client";
import prisma from "../../../DB/prismaClient";
import {
  TPostFacultysCreateDTU,
  TPostFacultysDTU,
  TPostFacultysUpdateDTU,
} from "../../../types/Companies/posts/faculty.types";
import { CacheData, RemoveCache } from "../../../utils/cache.control";

export class PostsFacultysService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;

  constructor() {
    this.model = "postFacultys";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TPostFacultysCreateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postFacultys.create({ data });
  }
  async CreateMany(data: TPostFacultysCreateDTU[]) {
    await RemoveCache(this.keys);
    return this.prisma.postFacultys.createMany({ data });
  }
  async Update(id: number, data: TPostFacultysUpdateDTU) {
    await RemoveCache(this.keys);
    return this.prisma.postFacultys.update({ where: { id }, data });
  }
  async Delete(id: number) {
    await RemoveCache(this.keys);
    return this.prisma.postFacultys.delete({ where: { id } });
  }
  async FindMany(): Promise<TPostFacultysDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }

  async FindOne(id: number) {
    const result: TPostFacultysDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }

  async FindAlready({ pId, fId }: TPostFacultysCreateDTU) {
    const result: TPostFacultysDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    return result.find((item) => item.pId === pId && item.fId === fId);
  }
}
