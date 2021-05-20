import { Composition } from "./Composition";
import { Loader } from "./Core/Loader";
import { ModelRepository } from "./Models";
import { TypeRepository, TypeTree } from "./Types";

export interface CompositionRepositoryOptions {
  modelRepository?: ModelRepository;
  typeRepository?: TypeRepository;
}

export class CompositionRepository {
  constructor(
    private loader: Loader,
    public modelRepository: ModelRepository,
    public typeRepository: TypeRepository
  ) {}

  public async load(composition: Composition, url?: URL) {
    if ((composition.types as TypeTree).name === undefined) {
      await this.typeRepository.loadFromUrl(
        new URL(composition.types.toString(), url)
      );
    } else {
      await this.typeRepository.load(composition.types as TypeTree);
    }
    await this.modelRepository.load(composition.modelsByType);
  }

  public async loadFromUrl(url: URL) {
    var module = await this.loader.importUrl(url);
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
        : this.typeRepository.typeTree || ({} as TypeTree),
      modelsByType: mbt,
    };
  }
}
