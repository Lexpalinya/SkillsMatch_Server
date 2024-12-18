import { TypeOrganinzationsService } from "../../services/Combo/typeOrganinzations.service";
import { TParams, TSet } from "../../types/utils/elysiaCustom.typs";
import { ModeldelHandlerController } from "./modelHandler.controller";

export class TypeOrganinzationsController {
  private controller;
  private typeOrganinzationsService;
  constructor() {
    this.typeOrganinzationsService = new TypeOrganinzationsService();
    this.controller = new ModeldelHandlerController(
      this.typeOrganinzationsService,
      "typeOrganinzations"
    );
  }
  async Create({
    body,
    set,
  }: {
    body: { name: string; visible?: boolean | string };
    set: TSet;
  }) {
    return this.controller.Create({ body, set });
  }
  async Update({
    body,
    set,
    params,
  }: {
    body: { name?: string; userId?: string; visible?: boolean | string };
    set: TSet;
    params: TParams;
  }) {
    return this.controller.Update({ body, set, params });
  }
  async Delete({ params, set }: { params: TParams; set: TSet }) {
    return this.controller.Delete({ params, set });
  }
  async SelectAll({ set }: { set: TSet }) {
    return this.controller.SelectAll({ set });
  }
  async SelectOne({ set, params }: { set: TSet; params: TParams }) {
    return this.controller.SelectOne({ set, params });
  }
  async SelectByVisible({
    set,
    query,
  }: {
    set: TSet;
    query: { visible: boolean | string };
  }) {
    return this.controller.SelectByVisible({ set, query });
  }
}
