import { ModelsOfType, TypedModel } from "./Model";

export interface ModelRepositoryOptions {
  typedModelLoadHook?: (typedModel: TypedModel) => TypedModel;
  modelsOfTypeLoadHook?: (modelsofType: ModelsOfType) => ModelsOfType;
}

export class ModelRepository {
  public modelsById: Map<string, TypedModel>;
  private typedModelLoadHook: (typedModel: TypedModel) => TypedModel;
  public modelsByTypeId: Map<string, ModelsOfType>;
  private modelsOfTypeLoadHook: (modelsofType: ModelsOfType) => ModelsOfType;

  constructor() {
    this.getModelById = this.getModelById.bind(this);
    this.modelsById = new Map();
    this.modelsByTypeId = new Map();
    this.typedModelLoadHook = ((tm) => tm);
    this.modelsOfTypeLoadHook = ((mot) => mot);
  }

  public updateOptions(options?:ModelRepositoryOptions){
    this.typedModelLoadHook = options?.typedModelLoadHook || this.typedModelLoadHook;
    this.modelsOfTypeLoadHook = options?.modelsOfTypeLoadHook || this.modelsOfTypeLoadHook;
  }

  public async load(modelsByType: ModelsOfType[]): Promise<void> {
    this.modelsById.clear();
    this.modelsByTypeId.clear();
    modelsByType.forEach((modelsWithTypeId) => {
      this.modelsByTypeId.set(
        modelsWithTypeId.typeId,
        this.modelsOfTypeLoadHook(modelsWithTypeId)
      );
      const typeId = modelsWithTypeId.typeId;
      modelsWithTypeId.models.forEach((model) => {
        const typedModel = model as TypedModel;
        typedModel.typeId = typeId;
        this.modelsById.set(model.id, this.typedModelLoadHook(typedModel));
      });
    });
  }

  public async getModelById(id: string): Promise<TypedModel> {
    const model = this.modelsById.get(id);
    if (model === undefined) throw new Error(`model with id: ${id}, not found`);
    return Promise.resolve(model);
  }

  public getModelsByTypeId(typeId: string): ModelsOfType | undefined {
    return this.modelsByTypeId.get(typeId);
  }

  public async upsertModel(model: TypedModel): Promise<void> {
    this.modelsById.set(model.id, model);
  }

  public async deleteModelById(id: string): Promise<void> {
    this.modelsById.delete(id);
  }
}
