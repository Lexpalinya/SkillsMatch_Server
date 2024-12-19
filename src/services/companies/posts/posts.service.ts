import { PrismaClient } from "@prisma/client";
import prisma from "../../../DB/prismaClient";
import {
  TPostCreateDTU,
  TPostsDTU,
  TPostUpdaateDTU,
} from "../../../types/Companies/posts/posts.type";
import { CacheData } from "../../../utils/cache.control";

export class PostsService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;
  private include = {};
  constructor() {
    this.model = "posts";
    this.keys = String(this.model);
    this.prisma = prisma;
  }
  async Create(data: TPostCreateDTU) {
    return this.prisma.posts.create({ data });
  }

  async Update(id: string, data: TPostUpdaateDTU) {
    return this.prisma.posts.update({ where: { id }, data });
  }
  async Delete(id: string) {
    return this.prisma.posts.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
  async FindMany() {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      include: this.include,
    });
  }

  async FindUnique(id: string): Promise<TPostsDTU | null> {
    return this.prisma.posts.findUnique({
      where: { id },
      include: this.include,
    });
  }
}
