import { Facultys } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class FacultyService implements ServiceInterface {
  private facultyHandler;
  constructor() {
    this.facultyHandler = new CreateModelHandlerService<Facultys>(
      "facultys"
    );
  }

  async Create(data: TmodelHandlerCreate): Promise<Facultys> {
    return this.facultyHandler.Create(data);
  }
  async Update(where: {}, data: TmodelHandlerUpdate): Promise<Facultys> {
    return this.facultyHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.facultyHandler.Delete(where);
  }
  async FindMany() {
    return this.facultyHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.facultyHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.facultyHandler.FindFilter("visible", where);
  }
  async FindByName(where: {}) {
    return this.facultyHandler.FindSearch("name", where);
  }
}
