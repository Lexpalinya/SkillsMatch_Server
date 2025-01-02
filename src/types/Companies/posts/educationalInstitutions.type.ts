import { PostEducationalInstitutions } from "@prisma/client";

export type TPostEducationalInstitutionsDTU = PostEducationalInstitutions;
export type TPostEducationalInstitutionsCreateDTU = {
  pId: string;
  eiId: string;
};

export type TPostEducationalInstitutionsCreateBodyDTU = {
  eiId: string;
};

export type TPostEducationalInstitutionsUpdateDTU =
  TPostEducationalInstitutionsCreateBodyDTU;
