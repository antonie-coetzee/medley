import { CompositionRepository } from "./CompositionRepository";
import { ViewEngine } from "./Core";
import { ModelRepository } from "./Models";
import { TypeRepository } from "./Types";
import { Loader } from "./Core/Loader";
import { Composition } from "./Composition";

export class Medley {
  public typeRepository: TypeRepository;
  public modelRepository: ModelRepository;
  public compositionRepository: CompositionRepository;
  public viewEngine: ViewEngine;
  public loader: Loader;

  constructor() {
    this.loader = new Loader();
    this.typeRepository = new TypeRepository(this.loader);
    this.modelRepository = new ModelRepository();
    this.compositionRepository = new CompositionRepository(
      this.loader,
      this.modelRepository,
      this.typeRepository
    );
    const getViewFunction = this.typeRepository.getViewFunction;
    const getModel = this.modelRepository.getModelById;
    this.viewEngine = new ViewEngine(getModel, getViewFunction);
  }

  public async load(composition: Composition, url?: URL) {
    await this.compositionRepository.load(composition);
  }

  public async loadFromUrl(url: URL) {
    await this.compositionRepository.loadFromUrl(url);
  }

  public async renderModel<T>(modelId: string, args: any[]): Promise<T> {
    return this.viewEngine.renderModel<T>(modelId, args);
  }
}
