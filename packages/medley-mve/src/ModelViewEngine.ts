import { CompositionRepository } from "./CompositionRepository";
import { ViewEngine } from "./Core";

export class ModelViewEngine {
  private viewEngine: ViewEngine;

  constructor(compositionRepo: CompositionRepository) {
    const getModel = compositionRepo.modelRepo.getModelById
    const getViewFunction = compositionRepo.typeRepo.getViewFunction;
    this.viewEngine = new ViewEngine(
      getModel,
      getViewFunction
    );
  }
  
  public async renderModel<T>(modelId: string, args: any[]): Promise<T> {
    return this.viewEngine.renderModel<T>(modelId, args);
  }
}
