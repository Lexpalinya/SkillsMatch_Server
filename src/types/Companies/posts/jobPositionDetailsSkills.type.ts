import { PostJobPositionsDetailsSkills } from "@prisma/client";

export type TPostJobPositionDetailsSkillsDTU = PostJobPositionsDetailsSkills;

export type TPostJobPositionDetailsSkillsCreateDTU = {
  sId: string;
  pjpId: number;
};
export type TPostJobPositionDetailsSkillsCreateBodyyDTU = { sId: string };

export type TPostJobPositionDetailsSkillsUpdateDTU = { sId: string };
