import {
  TPostJobPositionsDetailsCreateDTU,
  TPostJobPositionsDetailsDTU,
  TPostJobPositionsDetailsUpdateDTU,
} from "./../../../types/Companies/posts/jobPositionsDetails.type";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../DB/prismaClient";
import { CacheData, RemoveCache } from "../../../utils/cache.control";
import { PostsJobPositionDetailsSkillsService } from "./jobPositionDetailsSkills.service";
import { TJobPositionsDetails } from "../../../types/Companies/posts/posts.type";
import { AddIdObjectInArrayPostsJobPositionsDetails } from "../../../utils/controArrary";

export class PostsJobPositionsDetailsService {
  private keys: string;
  private model: keyof PrismaClient;
  private prisma: PrismaClient;
  private pjpdsService: PostsJobPositionDetailsSkillsService;

  constructor() {
    this.model = "postJobPositionsDetails";
    this.keys = String(this.model);
    this.prisma = prisma;
    this.pjpdsService = new PostsJobPositionDetailsSkillsService();
  }

  // Create a single job position detail
  async Create(data: TPostJobPositionsDetailsCreateDTU) {
    // Clear cache
    await RemoveCache(this.keys);
    // Create job position detail
    return this.prisma.postJobPositionsDetails.create({ data });
  }

  // Create multiple job position details
  async CreateMany(data: TJobPositionsDetails[]) {
    // Clear cache
    await RemoveCache(this.keys);

    // Process each item and wait for all operations
    const createResults = await Promise.all(
      data.map(async (item) => {
        const { sId = [], ...createData } = item; // Destructure and separate sId

        // Create the main record
        const pjpdResult = await this.prisma.postJobPositionsDetails.create({
          data: createData as unknown as TPostJobPositionsDetailsCreateDTU,
        });

        // Handle related operations if sId exists
        if (Array.isArray(sId) && sId.length > 0) {
          const relatedData = AddIdObjectInArrayPostsJobPositionsDetails(
            pjpdResult.id,
            sId,
            "jpId"
          );

          await this.pjpdsService.CreateMany(relatedData);
        }

        return pjpdResult; // Return created record for this item
      })
    );

    return createResults; // Array of created records
  }

  // Update a job position detail by ID
  async Update(id: number, data: TPostJobPositionsDetailsUpdateDTU) {
    // Clear cache
    await RemoveCache(this.keys);
    // Update job position detail
    return this.prisma.postJobPositionsDetails.update({ where: { id }, data });
  }

  // Delete a job position detail by ID
  async Delete(id: number) {
    // Clear cache
    await RemoveCache(this.keys);
    // Delete job position detail
    return this.prisma.postJobPositionsDetails.delete({ where: { id } });
  }

  // Find many job position details
  async FindMany(): Promise<TPostJobPositionsDetailsDTU[]> {
    // Fetch job position details from cache or database
    return CacheData({
      key: this.keys,
      model: this.model,
      where: {},
    });
  }

  // Find a single job position detail by ID
  async FindOne(id: number) {
    // Fetch job position details from cache or database
    const result: TPostJobPositionsDetailsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    // Find the specific job position detail by ID
    const Exists = result.find((item) => item.id === id);
    return Exists;
  }

  // Find an existing job position detail by post ID and job position ID
  async FindAlready({ pId, jpId }: TPostJobPositionsDetailsCreateDTU) {
    // Fetch job position details from cache or database
    const result: TPostJobPositionsDetailsDTU[] = await CacheData({
      key: this.keys,
      model: this.model,
      where: {},
      orderBy: {},
    });
    // Find the specific job position detail by post ID and job position ID
    return result.find((item) => item.pId === pId && item.jpId === jpId);
  }
}