import { BusinessModels } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class BusinessModelsService implements ServiceInterface {
  private businessModelsHandler;
  constructor() {
    this.businessModelsHandler = new CreateModelHandlerService<BusinessModels>(
      "businessModels"
    );
  }

  async Create(data: TmodelHandlerCreate): Promise<BusinessModels> {
    return this.businessModelsHandler.Create(data);
  }
  async Update(where: {}, data: TmodelHandlerUpdate): Promise<BusinessModels> {
    return this.businessModelsHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.businessModelsHandler.Delete(where);
  }
  async FindMany() {
    return this.businessModelsHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.businessModelsHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.businessModelsHandler.FindFilter("visible", where);
  }
  async FindByName(where: {}) {
    return this.businessModelsHandler.FindSearch("name", where);
  }
}
