import { EUserRole, Users } from "@prisma/client";

export type TCreateUserDTO = {
  username: string; // Made mandatory
  email: string; // Use `string` type for consistency
  phoneNumber: string;
  password: string;
  role: EUserRole; // Use the enum type
};

export type TBodyCreateDTO = Omit<TCreateUserDTO, "username"> & {
  username?: string;
};
export type TUpdateUserDTO = Partial<
  Omit<Users, "id" | "createdAt" | "updatedAt" | "isActive">
>;

export type TUpdateUserDTOValidate = Omit<
  Users,
  "id" | "createdAt" | "updatedAt" | "isActive"|"loginVersion"
>;
