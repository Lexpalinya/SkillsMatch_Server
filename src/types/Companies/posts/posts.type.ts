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
  | "checkInTime"
  | "checkOutTime"
> & {
  gpa?: string | number;
  workDate?: string | string[];
  workDay: string[];
  endDate?: string | Date;
  images?: File[];
  startSalary?: string | number;
  endSalary?: string | number;
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  languages: string | string[];
  studyCourses: string | string[];
  educationalInstitutions: string | string[];
  facultys: string | string[];
  jobpositionsDetails: string | TJobPositionsDetails[];
};

export type TJobPositionsDetails = {
  jpId: string;
  amount: number;
  detail: string;
  sId?: string[];
};

export type TPostCreateDTU = Omit<
  TPostsDTU,
  | "id"
  | "isActive"
  | "visible"
  | "createdAt"
  | "updatedAt"
  | "startSalary"
  | "endSalary"
  | "endDate"
  | "checkInTime"
  | "checkOutTime"
> & {
  startSalary: number | null;
  endSalary: number | null;
  endDate: Date | null;
  images: string[];
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
};

export type TPostsUpdaateDTU = Partial<
  Omit<TPostsDTU, "id" | "isActive" | "createdAt" | "updatedAt">
>;

export type TPostsUpdateBodyDTU = Partial<
  Omit<
    TPostsDTU,
    | "images"
    | "id"
    | "gpa"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "visible"
    | "startSalary"
    | "endSalary"
    | "workDay"
  >
> & {
  visible?: string | boolean;
  startSalary?: string | number;
  endSalary?: string | number;
  gpa?: string | number;
  workDate?: string | string[];
};
