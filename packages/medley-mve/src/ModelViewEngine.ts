import { CompositionRepository } from "./CompositionRepository";
import { ViewEngine } from "./Core";

export class ModelViewEngine {
  private viewEngine: ViewEngine;

  constructor(compositionRepo: CompositionRepository) {
    const getModelById = compositionRepo.getModelById.bind(compositionRepo);
    const getViewFunctionFromTypeId = compositionRepo.getViewFunctionFromTypeId.bind(compositionRepo);
    this.viewEngine = new ViewEngine(
      getModelById,
      getViewFunctionFromTypeId
    );
  }
  
  public async renderModel<T>(modelId: string, args: any[]): Promise<T> {
    return this.viewEngine.renderModel<T>(modelId, args);
  }
}
