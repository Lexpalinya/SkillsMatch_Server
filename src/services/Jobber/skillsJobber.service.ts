import { PrismaClient } from "@prisma/client";
import prisma from "../../DB/prismaClient";
import {
  TSkillsJobberCreateDTU,
  TSkillsJobberDTU,
  TSkillsJobberUpdateDTU,
} from "../../types/Jobber/skillsJobber.type";
import {
  CacheData,
  CacheDataFindByIdNotIsActive,
  CacheDataSearchNotIsActive,
} from "../../utils/cache.control";

export class SkillsJobbberService {
  private prisma;
  private model: keyof PrismaClient;
  private keys: string;
  private include = {
    educationLevels: {
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    },
    eductaionalInstitutions: {
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    },
    facultys: {
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    },
    studyCourse: {
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    },
    SkillJobberJobPositions: {
      where: {
        jobPositions: {
          isActive: true,
        },
      },
      select: {
        id: true,
        jobPositions: {
          select: { id: true, name: true, visible: true },
        },
      },
    },
    SkillJobberLanguage: {
      where: {
        languages: {
          isActive: true,
        },
      },
      select: {
        id: true,
        languages: {
          select: { id: true, name: true, visible: true },
        },
      },
    },
    SkillJobberSkills: {
      where: {
        skills: {
          isActive: true,
        },
      },
      select: {
        id: true,
        skills: {
          select: { id: true, name: true, visible: true },
        },
      },
    },
  };

  constructor() {
    this.model = "skillJobber";
    this.keys = String(this.model);
    this.prisma = prisma;
  }

  async Create(data: TSkillsJobberCreateDTU) {
    return this.prisma.skillJobber.create({
      data,
    });
  }

  async Update(id: string, updateData: TSkillsJobberUpdateDTU) {
    return this.prisma.skillJobber.update({
      where: { id },
      data: updateData,
    });
  }

  async FindMany(): Promise<TSkillsJobberDTU[]> {
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      include: this.include,
    });
  }
  async FindOne(id: string): Promise<TSkillsJobberDTU | null> {
    return CacheDataFindByIdNotIsActive({
      key: this.keys,
      model: this.model,
      where: {
        id: id,
      },

      include: this.include,
    });
  }
  async FindUserIdExists(id: string): Promise<TSkillsJobberDTU | null> {
    return CacheDataSearchNotIsActive({
      key: this.keys,
      model: this.model,
      where: { userId: id },

      search: "userId",
    });
  }

  async FindUnique(id: string): Promise<TSkillsJobberDTU | null> {
    return this.prisma.skillJobber.findUnique({
      where: { id },
      include: this.include,
    });
  }
}
