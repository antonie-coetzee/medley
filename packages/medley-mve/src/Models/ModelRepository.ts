import { ModelsOfType, TypedModel } from "./Model";

export class ModelRepository {
  private modelsById: Map<string, TypedModel>;
  private modelsByTypeId: Map<string, ModelsOfType>;

  constructor() {
    this.getModelById = this.getModelById.bind(this);
  }

  public async load(modelsByType: ModelsOfType[]): Promise<void> {
    this.modelsById = new Map();
    this.modelsByTypeId = new Map();
    modelsByType.forEach((modelsWithTypeId) => {
      this.modelsByTypeId.set(modelsWithTypeId.typeId, modelsWithTypeId);
      const typeId = modelsWithTypeId.typeId;
      modelsWithTypeId.models.forEach(model => {
        const typedModel = (model as TypedModel);
        typedModel.typeId = typeId;
        this.modelsById.set(model.id, typedModel);
      });    
    });
  }

  public async getModelById(id: string): Promise<TypedModel> {
    const model = this.modelsById.get(id);
    if (model === undefined)
      throw new Error(`model with id: ${id}, not found`);
    return Promise.resolve(model);
  }

  public async upsertModel(model: TypedModel): Promise<void> {
    this.modelsById.set(model.id, model);
  }

  public async deleteModelById(id: string): Promise<void> {
    this.modelsById.delete(id);
  }
}
