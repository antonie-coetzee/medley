import { Loader, ViewEngine } from "./core";
import { ModelGraphRepository } from "./Models";
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

  public async load(modelGraphUrl: string) {
    this.loader.reset();
    this.modelGraphRepo = new ModelGraphRepository(this.loader);
    await this.modelGraphRepo.loadFromUrl(this.formatUrl(modelGraphUrl));

    this.typeMapRepo = new TypeMapRepository(this.loader);
    const typeMap = this.modelGraphRepo.typeMap;
    if(typeof(typeMap) === "string"){
      await this.typeMapRepo.loadUrl(this.formatUrl(typeMap));
    }else{
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
