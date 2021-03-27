import { Loader, ViewEngine } from "./Core";
import { ModelGraph, ModelGraphRepository } from "./Models";
import { TypeMapRepository } from "./Types";

export class ModelViewEngine {
  public modelGraphRepo: ModelGraphRepository;
  public typeMapRepo: TypeMapRepository;
  private loader: Loader;
  private viewEngine: ViewEngine;
  public baseAddress: string;

  constructor() {
    this.loader = new Loader();
  }

  public setBasePath(baseAddress: string) {
    this.baseAddress = baseAddress;
  }

  private formatUrl(url: string) {
    return this.baseAddress + url;
  }

  public async loadFromUrl(modelGraphUrl: string) {
    this.loader.reset();
    var module = await this.loader.import(this.formatUrl(modelGraphUrl));
    const modelGraph: ModelGraph = module.default;
    await this.loadFromObject(modelGraph);
  }

  public async loadFromObject(modelGraph: ModelGraph) {
    this.loader.reset();
    this.modelGraphRepo = new ModelGraphRepository();
    await this.modelGraphRepo.load(modelGraph);
    this.typeMapRepo = new TypeMapRepository(this.loader);
    const typeMap = this.modelGraphRepo.typeMap;
    if (typeof typeMap === "string") {
      await this.typeMapRepo.loadUrl(this.formatUrl(typeMap));
    } else {
      await this.typeMapRepo.loadTypeMap(typeMap);
    }

    this.viewEngine = new ViewEngine(
      this.modelGraphRepo.getModelById,
      this.typeMapRepo.getViewFunctionFromTypeId
    );
  }

  public async renderModel<T>(modelId: string, args: any[]): Promise<T> {
    return this.viewEngine.renderModel<T>(modelId, args);
  }
}
