import { Loader, Model, Type, TypedModel, TypeTree } from "./core";
import { ModelRepository, TypeRepository, Composition } from ".";

export class CompositionRepository {
  private loadedComposition?: Composition;
  private modelRepository: ModelRepository;
  private typeRepository: TypeRepository;

  constructor(private loader: Loader) {
    this.typeRepository = new TypeRepository(loader);
    this.modelRepository = new ModelRepository();
  }

  public async load(composition: Composition, baseUrl?: URL) {
    this.loadedComposition = composition;
    this.typeRepository.load(composition.types, baseUrl);
    this.modelRepository.load(composition.modelsByType);
  }

  public async loadFromUrl(url: URL) {
    const composition: Composition = await this.loader.loadJson(url);
    this.loadedComposition = composition;
    this.load(composition, url);
  }

  public async getTypedModelById(modelId:string){
    return this.modelRepository.getModelById(modelId);
  }

  public upsertModel(type: Type, model: Model) {
    const hasType = this.typeRepository.hasTypeById(type.id);
    if (hasType === false) {
      this.typeRepository.addType(type);
    }
    this.modelRepository.upsertModel({ ...model, typeId: type.id });
  }

  public listModelsByTypeId(typeId: string) {
    return this.modelRepository.getModelsByTypeId(typeId);
  }

  public deleteModelById(modelId: string) {
    const typeId = this.modelRepository.getTypeIdFromModelId(modelId);
    this.modelRepository.deleteModelById(modelId);
    // prune type if not referenced
    if (typeId) {
      const models = this.modelRepository.getModelsByTypeId(typeId);
      if (models?.length == null || models?.length === 0) {
        this.typeRepository.deleteType(typeId);
      }
    }
  }

  public getTypeById(typeId: string) {
    return this.typeRepository.getTypeById(typeId);
  }

  public getTypes() {
    return this.typeRepository.getTypes();
  }

  public async getViewFunctionFromTypeId(typeId:string){
    return this.typeRepository.getViewFunction(typeId);
  }

  public deleteTypeById(typeId: string) {
    this.modelRepository.deleteModelsByTypeId(typeId);
    this.typeRepository.deleteType(typeId);
  }

  public getComposition() {
    const modelsByType = this.typeRepository
      .getTypes()
      .map((el) => {
        return {
          typeId: el.id,
          models: this.modelRepository
            .getModelsByTypeId(el.id)
            .map((tm) => ({ ...tm, typeId: undefined })),
        };
      })
      .filter((mbt) => mbt.models?.length > 0);
    const usedTypes = modelsByType.map((mbt) => mbt.typeId);
    return Promise.resolve({
      ...this.loadedComposition,
      types: usedTypes.map((typeId) => this.typeRepository.getTypeById(typeId)),
      modelsByType,
    });
  }
}
