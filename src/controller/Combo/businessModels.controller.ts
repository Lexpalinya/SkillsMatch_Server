import { BusinessModelsService } from "../../services/Combo/businessModels.service";
import { TParams, TSet } from "../../types/utils/elysiaCustom.typs";
import { ModeldelHandlerController } from "./modelHandler.controller";

export class BusinessModelsController {
  private controller;
  private businessModelsService;
  constructor() {
    this.businessModelsService = new BusinessModelsService();
    this.controller = new ModeldelHandlerController(
      this.businessModelsService,
      "businessModels"
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
  async Delete({ params, set }: { params: TParams; set: any }) {
    return this.controller.Delete({ params, set });
  }
  async SelectAll({ set }: { set: any }) {
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
