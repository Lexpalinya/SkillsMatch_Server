import Elysia from "elysia";
import { EAPI } from "../config/api.config";
import { UserRouter } from "./user.router";

import { LanguagesRouter } from "./Combo/languages.router";
import { StudyCourseRouter } from "./Combo/studyCourse.router";
import { FacultysRouter } from "./Combo/faculty.router";
import { BusinessModelsRouter } from "./Combo/businessModels.router";
import { EducationLevelsRouter } from "./Combo/educationLevels.router";
import { EducationalInstitustionsRouter } from "./Combo/educationalInstitutions.router";
import { JobPositionsRouter } from "./Combo/jobPositions.router";
import { SkillsRouter } from "./Combo/skills.router";
import { TypeOrganinzationsRouter } from "./Combo/typeOrganinzations.router";
import { JobberRouter } from "./Jobber/jobber.router";
import { CompaniesRouter } from "./Companies/companies.router";
import { SkillsJobberRouter } from "./Jobber/skillsJobber.router";
import { AboutCompanyRouter } from "./Companies/aboutCompany.router";
import { PostsRouter } from "./Companies/posts/posts.router";

export const IndexRouter = (app: Elysia) => {
  return app.group(EAPI, (app) =>
    app
      .use(UserRouter)
      .use(StudyCourseRouter)
      .use(FacultysRouter)
      .use(BusinessModelsRouter)
      .use(EducationLevelsRouter)
      .use(EducationalInstitustionsRouter)
      .use(JobPositionsRouter)
      .use(LanguagesRouter)
      .use(SkillsRouter)
      .use(TypeOrganinzationsRouter)
      .use(JobberRouter)
      .use(CompaniesRouter)
      .use(SkillsJobberRouter)
      .use(AboutCompanyRouter)
      .use(PostsRouter)
  );
};
