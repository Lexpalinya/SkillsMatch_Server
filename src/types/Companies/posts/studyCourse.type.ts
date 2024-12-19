import { PostStudyCourse } from "@prisma/client";

export type TPostStudyCouresDTU = PostStudyCourse;

export type TPostStudyCourseCreateBodyDTU = {
  scId: string;
};

export type TPostStudyCourseCreateDTU = { pId: string; scId: string };

export type TPostStudyCourseUpdateDTU = Partial<TPostStudyCourseCreateDTU>;
