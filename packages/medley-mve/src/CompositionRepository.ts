import { Composition } from "./Composition";
import { Loader, ViewFunction } from "./Core";
import { ModelRepository, TypedModel } from "./Models";
import { TypeRepository } from "./Types";

export class CompositionRepository {
  private composition: Composition;
  private modelRepo: ModelRepository;
  private typeRepo: TypeRepository;

  constructor(private loader: Loader) {}

  public async load(composition: Composition, url?: URL) {
    this.composition = composition;
    this.loader.reset();

    this.modelRepo = new ModelRepository();
    await this.modelRepo.load(composition.models);
    this.typeRepo = new TypeRepository(this.loader);
    const types = this.composition.types;
    if (typeof types === "string") {
      await this.typeRepo.loadFromUrl(new URL(types, url));
    } else {
      await this.typeRepo.load(types);
    }
  }

  public async loadFromUrl(url: URL) {
    var module = await this.loader.import(url.toString());
    const composition: Composition = module.default;
    await this.load(composition, url);
  }

  public getModelById(id: string): Promise<TypedModel> {
    return this.modelRepo.getModelById(id);
  }

  public getViewFunctionFromTypeId(typeId: string): Promise<ViewFunction> {
    return this.typeRepo.getViewFunctionFromTypeId(typeId);
  }
}
