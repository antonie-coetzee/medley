import { Composition } from "./Composition";
import { Loader, ViewFunction } from "./Core";
import { ModelRepository, ModelsOfType, TypedModel } from "./Models";
import { Type, TypeRepository, TypeTree } from "./Types";

export interface CompositionRepositoryOptions {
  loader?: Loader;
  modelRepository?: ModelRepository;
  typeRepository?: TypeRepository;
}

export class CompositionRepository {
  private loader: Loader;
  public modelRepository: ModelRepository;
  public typeRepository: TypeRepository;

  constructor(options?: CompositionRepositoryOptions) {
    this.loader = options?.loader || new Loader();
    this.modelRepository = options?.modelRepository || new ModelRepository();
    this.typeRepository =
      options?.typeRepository || new TypeRepository(this.loader);
  }

  public async load(composition: Composition, url?: URL) {
    this.loader.reset();
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
    var module = await this.loader.import(url);
    const composition: Composition = module.default;
    await this.load(composition, url);
  }

  public get composition(): Composition {
    const mot = Array.from(this.modelRepository.modelsByTypeId.values());
    const mbt = mot.map((val) => {
      val.models = val.models.map((m) => {     
        return {...m, typeId:undefined}
      });
      return val;
    });
    return {
      types: this.typeRepository.typesUrl
        ? new URL(this.typeRepository.typesUrl.toString())
        : this.typeRepository.typeTree,
      modelsByType: mbt,
    };
  }
}
