import { Jobber } from "@prisma/client";

export type TUpdateJobberDTO = Partial<Omit<Jobber, "id" | "createdAt" | "updatedAt" | "userId">>;

export type TCreateJobberDTO = Omit<
  Jobber,
  "id" | "createdAt" | "updatedAt" | "reason"|"isVerify"
>;

export type TCreateJobberBodyDTO = Omit<
  TCreateJobberDTO,
  "userId" | "docImage"
> & {
  docImage: File[];
};
