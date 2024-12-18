import { PrismaClient, Users } from "@prisma/client";
import prisma from "../DB/prismaClient";
import { TCreateUserDTO, TUpdateUserDTO } from "../types/user.type";
import {
  CacheDataFindById,
  CacheData,
  CacheDataSearch,
} from "../utils/cache.control";

export class UserService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
    this.model = "users";
    this.keys = String(this.model);
  }
  async create(userData: TCreateUserDTO): Promise<Users> {
    return this.prisma.users.create({
      data: {
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        role: userData.role,
      },
    });
  }
  async update(id: string, userUpdate: TUpdateUserDTO): Promise<Users> {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: userUpdate,
    });
  }
  async delete(id: string): Promise<Users> {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
  async findMany(): Promise<Users[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
    });
  }
  async findOne(id: string): Promise<Users | null> {
    return CacheDataFindById({
      key: this.keys,
      model: this.model,
      where: {
        id: id,
      },
    });
  }

  async findAlready(search: string, where: {}): Promise<Users | null> {
    return CacheDataSearch({
      key: this.keys,
      model: this.model,
      where: {
        isActive: true,
        ...where,
      },
      search,
    });
  }
}
