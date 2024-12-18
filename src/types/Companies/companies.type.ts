import { Companies } from "@prisma/client";
export type TCompaniesCreateBobyUTD = Omit<
  Companies,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "reason"
  | "isVerify"
  | "userId"
  | "docImage"
  | "headName"
> & {
  docImage: File[];
  headName?: string ;
};

export type TCompaniesCreateUTD = Omit<TCompaniesCreateBobyUTD, "docImage"> & {
  userId: string;
  docImage: string[];
};

export type TCompaniesUpdateUTD = Partial<
  Omit<Companies, "id" | "userId" | "createdAt" | "updatedAt" | "isVerify">
> & {
  isVerify?: boolean | undefined;
};
