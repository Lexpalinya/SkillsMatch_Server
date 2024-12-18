import { EducationalInstitutions } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class EducationalInstitutionsService implements ServiceInterface {
  private educationalInstitustionHandler;
  constructor() {
    this.educationalInstitustionHandler =
      new CreateModelHandlerService<EducationalInstitutions>(
        "educationalInstitutions"
      );
  }

  async Create(data: TmodelHandlerCreate): Promise<EducationalInstitutions> {
    return this.educationalInstitustionHandler.Create(data);
  }
  async Update(
    where: {},
    data: TmodelHandlerUpdate
  ): Promise<EducationalInstitutions> {
    return this.educationalInstitustionHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.educationalInstitustionHandler.Delete(where);
  }
  async FindMany() {
    return this.educationalInstitustionHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.educationalInstitustionHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.educationalInstitustionHandler.FindFilter("visible", where);
  }
  async FindByName(where: {}) {
    return this.educationalInstitustionHandler.FindSearch("name", where);
  }
}
