import { AboutCompany } from "@prisma/client";

export type TAboutCompanyDTU = AboutCompany;

export type TAboutCompanyCreateBodyDTU = Omit<
  TAboutCompanyDTU,
  "id" | "createdAt" | "updatedAt" | "isActive" | "images" | "visible"
> & {
  images: File[]; // Array of files for upload
  visible?: boolean; // Optional boolean
};

export type TAboutCompanyCreateDTU = Omit<
  TAboutCompanyDTU,
  "id" | "createdAt" | "updatedAt" | "isActive" | "visible"
> & {
  visible?: boolean; // Optional boolean
};

export type TAboutCompanyUpdateDTU = Partial<
  Omit<TAboutCompanyDTU, "id" | "createdAt" | "updatedAt" | "isActive"  >
>;

export type TAboutCompanyUpdateImage = {
  images: string[]; // Array of image URLs or paths
};
