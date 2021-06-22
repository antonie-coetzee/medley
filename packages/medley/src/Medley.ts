import { Loader, Model, LoaderOptions, Type, Composition } from "./core";
import { TypeRepository } from "./TypeRepository";
import { ModelRepository } from "./ModelRepository";
import { ViewEngine } from "./ViewEngine";
import { Migrate } from "./Migrate";

export interface MedleyOptions extends LoaderOptions {}

export class Medley {
  private loadedComposition?: Composition;
  private modelRepository: ModelRepository;
  private typeRepository: TypeRepository;
  private migrate: Migrate;
  private loader: Loader;
  private viewEngine: ViewEngine;

  constructor(private options?: MedleyOptions) {
    this.loader = new Loader(options || {});
    this.typeRepository = new TypeRepository(this.loader);
    this.modelRepository = new ModelRepository();
    const getViewFunctionFromType = this.typeRepository.getViewFunction;
    const getModel = this.modelRepository.getModelById;
    this.viewEngine = new ViewEngine(getModel, getViewFunctionFromType, options);
    this.migrate = new Migrate(this.modelRepository, this.typeRepository);
  }

  public async load(composition: Composition, baseUrl: URL) {
    this.loadedComposition = composition;
    this.typeRepository.load(composition.types, baseUrl);
    this.modelRepository.load(composition.modelsByType);
  }

  public async getViewFunction<T extends Function>(
    modelId: string,
    context?: {}
  ): Promise<T> {
    return this.viewEngine.getViewFunction(modelId, context);
  }

  public async getTypedModelById(modelId: string) {
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
    // delete type if not referenced
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

  public async getViewFunctionFromTypeId(typeId: string) {
    return this.typeRepository.getViewFunction(typeId);
  }

  public deleteTypeById(typeId: string) {
    this.modelRepository.deleteModelsByTypeId(typeId);
    this.typeRepository.deleteType(typeId);
  }

  public async migrateTypeUp(type:Type){
    return this.migrate.up(type);
  }

  public async migrateTypeDown(type:Type){
    return this.migrate.down(type);
  }

  public getComposition() {
    const types = this.typeRepository.getTypes();
    const modelsByType = types.map((el) => {
      return {
        typeId: el.id,
        // models with typeId removed
        models: this.modelRepository
          .getModelsByTypeId(el.id)
          .map((tm) => ({ ...tm, typeId: undefined })),
      };
    });
    return {
      ...this.loadedComposition,
      types,
      modelsByType,
    };
  }
}
