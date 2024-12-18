import { JobPositions } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class JobPositionsService implements ServiceInterface {
  private JobPositionsHandler;
  constructor() {
    this.JobPositionsHandler = new CreateModelHandlerService<JobPositions>(
      "jobPositions"
    );
  }

  async Create(data: TmodelHandlerCreate): Promise<JobPositions> {
    return this.JobPositionsHandler.Create(data);
  }
  async Update(where: {}, data: TmodelHandlerUpdate): Promise<JobPositions> {
    return this.JobPositionsHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.JobPositionsHandler.Delete(where);
  }
  async FindMany() {
    return this.JobPositionsHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.JobPositionsHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.JobPositionsHandler.FindFilter("visible", where);
  }
  async FindByName(where: {}) {
    return this.JobPositionsHandler.FindSearch("name", where);
  }
}
