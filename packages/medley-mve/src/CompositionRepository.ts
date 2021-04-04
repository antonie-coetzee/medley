import Url from "url-parse";
import { Composition } from "./Composition";
import { Loader, ViewFunction } from "./Core";
import { ModelRepository, ModelsOfType, TypedModel } from "./Models";
import { Type, TypeRepository, TypeTree } from "./Types";

export interface CompositionRepositoryOptions {
  loader?: Loader;
  modelRepo?: ModelRepository;
  typeRepo?: TypeRepository;
}

export class CompositionRepository {
  private loader: Loader;
  public modelRepo: ModelRepository;
  public typeRepo: TypeRepository;

  constructor(options?: CompositionRepositoryOptions) {
    this.loader = options?.loader || new Loader();
    this.modelRepo = options?.modelRepo || new ModelRepository();
    this.typeRepo = options?.typeRepo || new TypeRepository(this.loader);
  }

  public async load(composition: Composition, url?: Url) {
    this.loader.reset();
    if (typeof composition.types === "string") {
      await this.typeRepo.loadFromUrl(new Url(composition.types, url));
    } else {
      await this.typeRepo.load(composition.types);
    }
    await this.modelRepo.load(composition.modelsByType);
  }

  public async loadFromUrl(url: string) {
    const compoUrl = new Url(url);
    var module = await this.loader.import(compoUrl);
    const composition: Composition = module.default;
    await this.load(composition, compoUrl);
  }

  public get composition(): Composition {
    return {
      types: this.typeRepo.typesUrl
        ? this.typeRepo.typesUrl.toString()
        : this.typeRepo.typeTree,
      modelsByType: Array.from(this.modelRepo.modelsByTypeId.values()),
    };
  }
}
