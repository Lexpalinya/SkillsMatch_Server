import { Jobber, PrismaClient } from "@prisma/client";
import prisma from "../../DB/prismaClient";
import { TCreateJobberDTO, TUpdateJobberDTO } from "../../types/Jobber/jobber.type";
import {
  CacheData,
  CacheDataFindByIdNotIsActive,
  CacheDataSearchNotIsActive,
} from "../../utils/cache.control";

export class JobberService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
    this.model = "jobber";
    this.keys = String(this.model);
  }

  async Create(data: TCreateJobberDTO): Promise<Jobber> {
    return this.prisma.jobber.create({ data });
  }

  async Update(id: string, updateData: TUpdateJobberDTO): Promise<Jobber> {
    return this.prisma.jobber.update({
      where: { id },
      data: { ...updateData },
    });
  }

  async FindMany(): Promise<Jobber[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }
  async FindOne(id: string): Promise<Jobber | null> {
    return CacheDataFindByIdNotIsActive({
      key: this.keys,
      model: this.model,
      where: {
        id: id,
      },
    });
  }
  async FindUserIdExists(id: string) {
    return CacheDataSearchNotIsActive({
      key: this.keys,
      model: this.model,
      where: { userId: id },
      search: "userId",
    });
  }
}
