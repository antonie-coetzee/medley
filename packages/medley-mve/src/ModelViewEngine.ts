import { CompositionRepository } from "./CompositionRepository.js";
import { ViewEngine } from "./Core/index.js";

export class ModelViewEngine {
  private viewEngine: ViewEngine;

  constructor(compositionRepo: CompositionRepository) {
    const getModel = compositionRepo.modelRepository.getModelById
    const getViewFunction = compositionRepo.typeRepository.getViewFunction;
    this.viewEngine = new ViewEngine(
      getModel,
      getViewFunction
    );
  }
  
  public async renderModel<T>(modelId: string, args: any[]): Promise<T> {
    return this.viewEngine.renderModel<T>(modelId, args);
  }
}
