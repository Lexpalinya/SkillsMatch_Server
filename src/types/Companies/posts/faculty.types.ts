import { PostFacultys } from "@prisma/client";

export type TPostFacultysDTU = PostFacultys;
export type TPostFacultysCreateDTU = {
  pId: string;
  fId: string;
};

export type TPostFacultysCreateBodyDTU = {
  fId: string;
};

export type TPostFacultysUpdateDTU = TPostFacultysCreateBodyDTU;
