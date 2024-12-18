import { ECurrency, SkillJobber } from "@prisma/client";

export type TSkillsJobberDTU = SkillJobber;

export type TSkillsJobberCreateDTU = Omit<
  TSkillsJobberDTU,
  "id" | "createdAt" | "updatedAt"
>;

export type TSkillsJobberCreateBodyDTU = Omit<
  TSkillsJobberCreateDTU,
  | "userId"
  | "drivingCardType"
  | "starSalary"
  | "checkInTime"
  | "checkOutTime"
  | "gpa"
  | "workDay"
  | "startSalary"
> & {
  drivingCardType?: string | null;
  gpa: string | number;
  startSalary?: string | number;
  workDay: string | string[];
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  userId?: string;
  skills: string | string[];
  jobPositions: string | string[];
  languages: string | string[];
};
export type TSkillsJobberUpdateDTU = {
  elId?: string;
  eiId?: string;
  fId?: string;
  scId?: string;
  gpa?: number;
  drivingCardType?: string;
  more?: string;
  startSalary?: number;
  currency?: ECurrency;
  workDay?: string[];
  checkInTime?: Date;
  checkOutTime?: Date;
};
export type TSkillsJobberUpdateBodyDTU = Omit<
  TSkillsJobberUpdateDTU,
  "gpa" | "startSalary" | "workDay"
> & {
  gpa?: string | number;
  startSalary?: string | number;
  workDay?: string | string[];
};
