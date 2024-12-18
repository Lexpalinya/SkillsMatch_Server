import { SkillJobberLanguage } from "@prisma/client";

export type TSkillsJobberLanguageDTU = SkillJobberLanguage;

export type TSkillsJobberLanguageCreateBodyDTU = Omit<
  TSkillsJobberLanguageDTU,
  "id" | "sjId"
>;

export type TSkillsJobberLanguageCreateDTU = Omit<
  TSkillsJobberLanguageDTU,
  "id"
>;

export type TSkillssJobberLanguageUpdateDTU =
  Partial<TSkillsJobberLanguageCreateDTU>;
