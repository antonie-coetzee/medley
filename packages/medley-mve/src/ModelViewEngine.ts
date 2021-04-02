import { CompositionRepository } from "./CompositionRepository";
import { ViewEngine } from "./Core";

export class ModelViewEngine {
  private compositionRepo: CompositionRepository
  private viewEngine: ViewEngine;

  constructor(compositionRepo: CompositionRepository) {
    this.viewEngine = new ViewEngine(
      this.compositionRepo.getModelById,
      this.compositionRepo.getViewFunctionFromTypeId
    );
  }
  
  public async renderModel<T>(modelId: string, args: any[]): Promise<T> {
    return this.viewEngine.renderModel<T>(modelId, args);
  }
}
