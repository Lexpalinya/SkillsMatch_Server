import { SkillJobberJobPositions } from "@prisma/client";

export type TSkillsJobberJobPositionsDTU = SkillJobberJobPositions;

export type TSkillsJobberJobPositionsCreateDTU = Omit<
  TSkillsJobberJobPositionsDTU,
  "id"
>;
export type TSkillsJobberJobPositionsCreateBodyDTU = Omit<
  TSkillsJobberJobPositionsDTU,
  "id" | "sjId"
>;

export type TSkillsJobberJobPositionsUpdateDTU =
  Partial<TSkillsJobberJobPositionsCreateDTU>;
