import { JobPositionsService } from "../services/Combo/jobPositions.service";
import { SkillsService } from "../services/Combo/skills.service";
import { TJobPositionsDetails } from "../types/Companies/posts/posts.type";
import { EMessage } from "./message";

const jpService = new JobPositionsService();
const skillsService = new SkillsService();
export const ValidateLengthBody = (body: object): boolean => {
  if (Object.keys(body).length === 0) return true;
  return false;
};

export const validateElementsExists = async (
  elements: string[],
  service: any,
  set: any,
  type: string
): Promise<void> => {
  for (const el of elements) {
    const result = await service.FindOne(el);
    if (!result) {
      throw new Error(`${EMessage.ERROR_NOT_FOUND} ${type} id: ${el}`);
    }
  }
};

export const validateElementsJobPositionDetailsExists = async (
  elements: TJobPositionsDetails[]
): Promise<void> => {
  for (const el of elements) {
    const result = await jpService.FindOne(el.jpId);

    if (!result) {
      throw new Error(
        `${EMessage.ERROR_NOT_FOUND} Post_JobPositions id: ${el.jpId}`
      );
    }
    const skills = el.sId;
    for (const el of skills) {
      const result = await skillsService.FindOne(el);
      if (!result) {
        throw new Error(
          `${EMessage.ERROR_NOT_FOUND} Post_JobPositions_Skill id: ${el}`
        );
      }
    }
  }
};
