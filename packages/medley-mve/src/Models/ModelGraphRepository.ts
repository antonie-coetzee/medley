import { Loader } from "../Core";
import { TypeMap } from "../Types";
import { TypedModel } from "./Model";
import { ModelGraph } from "./ModelGraph";


export class ModelGraphRepository {
  public typeMap: string | TypeMap;
  private modelMap: Map<string, TypedModel>;

  constructor() {
    this.getModelById = this.getModelById.bind(this);
  }

  public async load(modelGraph: ModelGraph): Promise<void> {
    this.typeMap = modelGraph.typeMap;
    this.modelMap = new Map();
    modelGraph.modelsByType.forEach((modulesWithTypeId) => {
      const typeId = modulesWithTypeId.typeId;
      modulesWithTypeId.models.forEach(model => {
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
