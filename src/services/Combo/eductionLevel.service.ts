import { EducationLevels } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class EducationLevelService implements ServiceInterface {
  private educationLevelHandler;
  constructor() {
    this.educationLevelHandler = new CreateModelHandlerService<EducationLevels>(
      "educationLevels"
    );
  }

  async Create(data: TmodelHandlerCreate): Promise<EducationLevels> {
    return this.educationLevelHandler.Create(data);
  }
  async Update(where: {}, data: TmodelHandlerUpdate): Promise<EducationLevels> {
    return this.educationLevelHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.educationLevelHandler.Delete(where);
  }
  async FindMany() {
    return this.educationLevelHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.educationLevelHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.educationLevelHandler.FindFilter("visible", where);
  }
  async FindByName(where: {}) {
    return this.educationLevelHandler.FindSearch("name", where);
  }
}
