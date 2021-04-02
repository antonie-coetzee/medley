import { Loader } from "../Core";
import { TypeTree } from "../Types";
import { ModelsByTypeId, TypedModel } from "./Model";

export class ModelRepository {
  private modelMap: Map<string, TypedModel>;

  constructor() {
    this.getModelById = this.getModelById.bind(this);
  }

  public async load(models: ModelsByTypeId[]): Promise<void> {
    this.modelMap = new Map();
    models.forEach((modelsWithTypeId) => {
      const typeId = modelsWithTypeId.typeId;
      modelsWithTypeId.models.forEach(model => {
        const typedModel = (model as TypedModel);
        typedModel.typeId = typeId;
        this.modelMap.set(model.id, typedModel);
      });    
    });
  }

  public async getModelById(id: string): Promise<TypedModel> {
    const model = this.modelMap.get(id);
    if (model === undefined)
      throw new Error(`model with id: ${id}, not found`);
    return Promise.resolve(model);
  }

  public async upsertModel(model: TypedModel): Promise<void> {
    this.modelMap.set(model.id, model);
  }

  public async deleteModelById(id: string): Promise<void> {
    this.modelMap.delete(id);
  }
}
