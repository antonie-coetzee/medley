import { Composition } from "./Composition.ts";
import { ModelRepository } from "./Models/index.ts";
import { TypeRepository, TypeTree } from "./Types/index.ts";

export interface CompositionRepositoryOptions {
  modelRepository?: ModelRepository;
  typeRepository?: TypeRepository;
}

export class CompositionRepository {
  public modelRepository: ModelRepository;
  public typeRepository: TypeRepository;

  constructor(options?: CompositionRepositoryOptions) {
    this.modelRepository = options?.modelRepository || new ModelRepository();
    this.typeRepository = options?.typeRepository || new TypeRepository();
  }

  public async load(composition: Composition, url?: URL) {
    if ((composition.types as TypeTree).name === undefined) {
      await this.typeRepository.loadFromUrl(
        new URL(composition.types.toString(), url),
      );
    } else {
      await this.typeRepository.load(composition.types as TypeTree);
    }
    await this.modelRepository.load(composition.modelsByType);
  }

  public async loadFromUrl(url: URL) {
    var module = await import(url.toString());
    const composition: Composition = module.default;
    await this.load(composition, url);
  }

  public get composition(): Composition {
    const mot = Array.from(this.modelRepository.modelsByTypeId.values());
    const mbt = mot.map((val) => {
      val.models = val.models.map((m) => {
        return { ...m, typeId: undefined };
      });
      return val;
    });
    return {
      types: this.typeRepository.typesUrl
        ? new URL(this.typeRepository.typesUrl.toString())
        : this.typeRepository.typeTree || {} as TypeTree,
      modelsByType: mbt,
    };
  }
}
