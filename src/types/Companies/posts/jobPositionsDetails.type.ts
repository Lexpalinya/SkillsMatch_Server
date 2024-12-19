import { PostJobPositionsDetails } from "@prisma/client";

export type TPostJobPositionsDetailsDTU = PostJobPositionsDetails;

export type TPostJobPositionsDetailsCreateDTU = Omit<
  TPostJobPositionsDetailsDTU,
  "id"
>;

export type TPostJobPositionsDetailsCreateBodyDTU = Omit<
  TPostJobPositionsDetailsCreateDTU,
  "pId" | "amount"
> & { amount?: string | number };

export type TPostJobPositionsDetailsUpdateDTU = Partial<
  Omit<TPostJobPositionsDetailsCreateDTU, "pId">
>;
