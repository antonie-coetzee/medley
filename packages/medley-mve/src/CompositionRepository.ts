import Url from "url-parse";
import { Composition } from "./Composition";
import { Loader, ViewFunction } from "./Core";
import { ModelRepository, TypedModel } from "./Models";
import { TypeRepository, TypeTree } from "./Types";

export class CompositionRepository {
  private loader: Loader;
  private composition: Composition;
  private modelRepo: ModelRepository;
  private typeRepo: TypeRepository;

  constructor() {
    this.loader = new Loader();
  }

  public async load(composition: Composition, url?: Url) {
    this.composition = composition;
    this.loader.reset();

    this.modelRepo = new ModelRepository();
    await this.modelRepo.load(composition.modelsByType);
    this.typeRepo = new TypeRepository(this.loader);
    const types = this.composition.types;
    if (typeof types === "string") {
      await this.typeRepo.loadFromUrl(new Url(types, url));
    } else {
      await this.typeRepo.load(types);
    }
  }

  public async loadFromUrl(url: string) {
    const compoUrl = new Url(url);
    var module = await this.loader.import(compoUrl);
    const composition: Composition = module.default;
    await this.load(composition, compoUrl);
  }

  public getModelById(id: string): Promise<TypedModel> {
    return this.modelRepo.getModelById(id);
  }

  public getViewFunctionFromTypeId(typeId: string): Promise<ViewFunction> {
    return this.typeRepo.getViewFunctionFromTypeId(typeId);
  }

  public getTypeTree(): TypeTree {
    return this.typeRepo.typeTree;
  }
}
