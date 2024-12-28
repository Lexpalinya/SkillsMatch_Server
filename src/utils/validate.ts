import { JobPositionsService } from "../services/Combo/jobPositions.service";
import { SkillsService } from "../services/Combo/skills.service";
import { TJobPositionsDetails } from "../types/Companies/posts/posts.type";
import { EMessage } from "./message";

// Initialize services
const jpService = new JobPositionsService();
const skillsService = new SkillsService();

/**
 * Validates if the body object is empty.
 * @param body - The object to validate.
 * @returns True if the body is empty, otherwise false.
 */
export const ValidateLengthBody = (body: object): boolean => {
  if (Object.keys(body).length === 0) return true;
  return false;
};

/**
 * Validates if elements exist in the specified service.
 * @param elements - The array of element IDs to validate.
 * @param service - The service to use for validation.
 * @param set - The response object to set the status code.
 * @param type - The type of elements being validated.
 * @returns A promise that resolves if all elements exist, otherwise throws an error.
 */
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

/**
 * Validates if job position details and their skills exist.
 * @param elements - The array of job position details to validate.
 * @returns A promise that resolves if all job position details and their skills exist, otherwise throws an error.
 */
export const validateElementsJobPositionDetailsExists = async (
  elements: TJobPositionsDetails[]
): Promise<void> => {
  for (const el of elements) {
    // Validate job position detail
    const result = await jpService.FindOne(el.jpId);
    if (!result) {
      throw new Error(
        `${EMessage.ERROR_NOT_FOUND} Post_JobPositions id: ${el.jpId}`
      );
    }

    // Validate skills associated with the job position detail
    const skills = el.sId ?? [];
    for (const skillId of skills) {
      const skillResult = await skillsService.FindOne(skillId);
      if (!skillResult) {
        throw new Error(
          `${EMessage.ERROR_NOT_FOUND} Post_JobPositions_Skill id: ${skillId}`
        );
      }
    }
  }
};