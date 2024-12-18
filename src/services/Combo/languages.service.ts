import { Languages } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class LanguagesService implements ServiceInterface {
  private languagesHandler;
  constructor() {
    this.languagesHandler = new CreateModelHandlerService<Languages>(
      "languages"
    );
  }

  async Create(data: TmodelHandlerCreate): Promise<Languages> {
    return this.languagesHandler.Create(data);
  }
  async Update(where: {}, data: TmodelHandlerUpdate): Promise<Languages> {
    return this.languagesHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.languagesHandler.Delete(where);
  }
  async FindMany() {
    return this.languagesHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.languagesHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.languagesHandler.FindFilter("visible", where);
  }
  async FindByName(where: {}) {
    return this.languagesHandler.FindSearch("name", where);
  }
}
