import { Skills } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class SkillsService implements ServiceInterface {
  private skillsHandler;
  constructor() {
    this.skillsHandler = new CreateModelHandlerService<Skills>("skills");
  }

  async Create(data: TmodelHandlerCreate): Promise<Skills> {
    return this.skillsHandler.Create(data);
  }
  async Update(where: {}, data: TmodelHandlerUpdate): Promise<Skills> {
    return this.skillsHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.skillsHandler.Delete(where);
  }
  async FindMany() {
    return this.skillsHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.skillsHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.skillsHandler.FindSearch("visible", where);
  }
  async FindByName(where: {}) {
    return this.skillsHandler.FindSearch("name", where);
  }
}
