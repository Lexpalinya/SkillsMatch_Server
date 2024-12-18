import { StudyCourse } from "@prisma/client";
import { CreateModelHandlerService } from "./modelHandler.service";
import {
  ServiceInterface,
  TmodelHandlerCreate,
  TmodelHandlerUpdate,
} from "../../types/modelHandler.type";

export class StudyCourseService implements ServiceInterface {
  private studyCourseHandler;
  constructor() {
    this.studyCourseHandler = new CreateModelHandlerService<StudyCourse>(
      "studyCourse"
    );
  }

  async Create(data: TmodelHandlerCreate): Promise<StudyCourse> {
    return this.studyCourseHandler.Create(data);
  }
  async Update(where: {}, data: TmodelHandlerUpdate): Promise<StudyCourse> {
    return this.studyCourseHandler.Update(where, data);
  }
  async Delete(where: {}) {
    return this.studyCourseHandler.Delete(where);
  }
  async FindMany() {
    return this.studyCourseHandler.FindMany();
  }
  async FindOne(id: string) {
    return this.studyCourseHandler.FindOne(id);
  }
  async SelectVisible(where: {}) {
    return this.studyCourseHandler.FindFilter("visible", where);
  }
  async FindByName(where: {}) {
    return this.studyCourseHandler.FindSearch("name", where);
  }
}
