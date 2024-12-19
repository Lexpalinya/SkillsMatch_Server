import { Posts } from "@prisma/client";

export type TPostsDTU = Posts;

export type TPostsCreateBodyDTU = Omit<
  TPostsDTU,
  | "id"
  | "isActive"
  | "visivle"
  | "images"
  | "gpa"
  | "createdAt"
  | "updatedAt"
  | "startSalary"
  | "endSalary"
  | "endDate"
> & {
  endDate?: string;
  images?: File[];
  startSalary?: string | number;
  endSalary?: string | number;
  languages: string | string[];
  studyCourses: string | string[];
  educationalInstitutions: string | string[];
  facultys: string | string[];
  jobpositionsDetails: string | TJobPositionsDetails;
};

type TJobPositionsDetails = {
  jpId: string;
  amount: number;
  detail: string;
  sId: string[];
};

export type TPostCreateDTU = Omit<
  TPostsDTU,
  "id" | "isActive" | "visivle" | "createdAt" | "updatedAt"
> & {
  startSalary?: number;
  endSalary?: number;
  endDate?: string;
  images?: string;
};

export type TPostUpdaateDTU = Partial<Omit<TPostCreateDTU, "images">>;
