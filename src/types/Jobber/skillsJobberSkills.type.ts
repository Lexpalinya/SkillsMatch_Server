import { SkillJobberSkills } from "@prisma/client";

export type TSkillsJobberSkillsDTU = SkillJobberSkills;

export type TSkillsJobberSkillsCreateDTU = Omit<TSkillsJobberSkillsDTU, "id">;
export type TSkillsJobberSkillsCreateBodyDTU = Omit<
  TSkillsJobberSkillsDTU,
  "id" | "sjId"
>;

export type TSkillsJobberSkillsUpdateDTU =
  Partial<TSkillsJobberSkillsCreateDTU>;
