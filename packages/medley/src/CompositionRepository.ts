import { Loader, TypeTree } from "./core";
import { ModelRepository, TypeRepository, Composition } from ".";

export class CompositionRepository {
  constructor(
    private loader: Loader,
    public modelRepository: ModelRepository,
    public typeRepository: TypeRepository
  ) {}

  public async load(composition: Composition, url?: URL) {
    if ((composition.types as TypeTree).name == null) {
      await this.typeRepository.loadFromUrl(composition.types.toString(), url);
    } else {
      await this.typeRepository.load(composition.types as TypeTree, url);
    }
    await this.modelRepository.load(composition.modelsByType);
  }

  public async loadFromUrl(url: URL) {
    const composition: Composition = await this.loader.loadJson(url);
    await this.load(composition, url);
  }

  public getComposition(): Promise<Composition> {
    const mot = Array.from(this.modelRepository.modelsByTypeId.values());
    const mbt = mot.map((val) => {
      val.models = val.models.map((m) => {
        return { ...m, typeId: undefined };
      });
      return val;
    });
    return Promise.resolve({
      types: this.typeRepository.resolvedTypeTree || ({} as TypeTree),
      modelsByType: mbt,
    });
  }
}
