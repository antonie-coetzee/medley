import { Composition } from "./Composition";
import { CompositionRepository } from "./CompositionRepository";
import { Loader, Platform } from "./core";
import { ModelRepository } from "./ModelRepository";
import { TypeRepository } from "./TypeRepository";
import { ViewEngine } from "./ViewEngine";

export interface MedleyOptions extends Platform {}

export class Medley {
  public typeRepository: TypeRepository;
  public modelRepository: ModelRepository;
  public compositionRepository: CompositionRepository;
  public viewEngine: ViewEngine;
  public loader: Loader;

  constructor(options?: MedleyOptions) {
    this.loader = new Loader(options || {});
    this.typeRepository = new TypeRepository(this.loader);
    this.modelRepository = new ModelRepository();
    this.compositionRepository = new CompositionRepository(
      this.loader,
      this.modelRepository,
      this.typeRepository
    );
    const getViewFunctionFromType = this.typeRepository.getViewFunction;
    const getModel = this.modelRepository.getModelById;
    this.viewEngine = new ViewEngine(getModel, getViewFunctionFromType);
  }

  public async load(composition: Composition, url?: URL) {
    await this.compositionRepository.load(composition);
  }

  public async loadFromUrl(url: URL) {
    await this.compositionRepository.loadFromUrl(url);
  }

  public async getViewFunction<T extends Function>(modelId:string, context?:{}):Promise<T>{
    return this.viewEngine.getViewFunction(modelId, context);
  }
}
