import { v4 as uuidv4} from "uuid";
import { ModelsOfType, TypedModel } from "./core";

export interface ModelRepositoryHooks {
  typedModelLoadHook?: (typedModel: TypedModel) => TypedModel;
  modelsOfTypeLoadHook?: (modelsofType: ModelsOfType) => ModelsOfType;
}

export class ModelRepository {
  public modelsById: Map<string, TypedModel> = new Map();
  private typedModelLoadHook: (typedModel: TypedModel) => TypedModel = (tm) =>
    tm;
  public modelsByTypeId: Map<string, ModelsOfType> = new Map();
  private modelsOfTypeLoadHook: (modelsofType: ModelsOfType) => ModelsOfType = (
    mot,
  ) => mot;

  constructor() {
    this.getModelById = this.getModelById.bind(this);
  }

  public updateHooks(hooks?: ModelRepositoryHooks) {
    this.typedModelLoadHook = hooks?.typedModelLoadHook ||
      this.typedModelLoadHook;
    this.modelsOfTypeLoadHook = hooks?.modelsOfTypeLoadHook ||
      this.modelsOfTypeLoadHook;
  }

  public async load(modelsByType: ModelsOfType[]): Promise<void> {
    this.modelsById.clear();
    this.modelsByTypeId.clear();
    modelsByType.forEach((modelsWithTypeId) => {
      const modelsOfType = this.modelsOfTypeLoadHook(modelsWithTypeId);
      this.modelsByTypeId.set(modelsWithTypeId.typeId, modelsOfType);
      const typeId = modelsWithTypeId.typeId;
      modelsWithTypeId.models.forEach((model) => {
        const typedModel = this.typedModelLoadHook(model as TypedModel);
        typedModel.typeId = typeId;
        this.modelsById.set(model.id, typedModel);
      });
    });
  }

  public async getModelById(id: string): Promise<TypedModel> {
    const model = this.modelsById.get(id);
    if (model == null) throw new Error(`model with id: ${id}, not found`);
    return Promise.resolve(model);
  }

  public getModelsByTypeId(typeId: string): ModelsOfType | undefined {
    return this.modelsByTypeId.get(typeId);
  }

  public async upsertModel(model: Partial<TypedModel>): Promise<void> {
    const currentModel = this.modelsById.get(model.id || "");

    if (currentModel?.typeId == null && model.typeId == null) {
      throw new Error("typeId missing");
    }
    const typeId = currentModel?.typeId || model.typeId || "";
    const uModel: TypedModel = {
      ...model,
      typeId,
      id: currentModel?.id || uuidv4(),
      name: model.name || currentModel?.name,
    };

    const modelGroup = this.getModelsByTypeId(typeId);
    if (modelGroup == null) {
      // no models of this type yet
      const modelsOfType = this.modelsOfTypeLoadHook({
        typeId,
        models: [uModel],
      });
      this.modelsByTypeId.set(typeId, modelsOfType);
    } else if (currentModel == null) {
      // new model instert
      modelGroup.models.push(this.typedModelLoadHook(uModel));
    }
    this.modelsById.set(uModel.id, uModel); // add/update model index
  }

  public async deleteModelById(id: string): Promise<void> {
    this.modelsById.delete(id);
  }
}
