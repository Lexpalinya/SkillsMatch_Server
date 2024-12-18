import { TypeOrganinzations } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class TypeOrganinzationsService implements ServiceInterface {
  private typeOrganinzationsHandler;
  constructor() {
    this.typeOrganinzationsHandler =
      new CreateModelHandlerService<TypeOrganinzations>("typeOrganinzations");
  }

  async Create(data: TmodelHandlerCreate): Promise<TypeOrganinzations> {
    return this.typeOrganinzationsHandler.Create(data);
  }
  async Update(
    where: {},
    data: TmodelHandlerUpdate
  ): Promise<TypeOrganinzations> {
    return this.typeOrganinzationsHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.typeOrganinzationsHandler.Delete(where);
  }
  async FindMany() {
    return this.typeOrganinzationsHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.typeOrganinzationsHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.typeOrganinzationsHandler.FindFilter("visible", where);
  }
  async FindByName(where: {}) {
    return this.typeOrganinzationsHandler.FindSearch("name", where);
  }
}
