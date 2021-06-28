import { v4 as uuidv4 } from "uuid";
import { Model, ModelsByType, Type, TypedModel } from "./core";

export class ModelRepository {
  public typedModelIndex: Map<string, TypedModel> = new Map();

  constructor() {}

  public load(modelsByType: ModelsByType[]): void {
    this.typedModelIndex.clear();
    modelsByType.forEach((modelsWithTypeId) => {
      const models = modelsWithTypeId.models;
      models.forEach((model) => {
        const typedModel = { ...model, typeId: modelsWithTypeId.typeId };
        this.typedModelIndex.set(model.id, typedModel);
      });
    });
  }

  public getModelById = (id: string): TypedModel => {
    const model = this.typedModelIndex.get(id);
    if (model == null) throw new Error(`model with id: ${id}, not found`);
    return model;
  };

  public getTypeIdFromModelId(id: string) {
    const model = this.typedModelIndex.get(id);
    return model?.typeId;
  }

  public getModelsByTypeId(typeId: string): TypedModel[] {
    return Array.from(this.typedModelIndex.values()).filter(
      (el) => el.typeId === typeId
    );
  }

  public getModels(): TypedModel[] {
    return Array.from(this.typedModelIndex.values());
  }

  public getUsedTypeIds(): string[] {
    const typeMap = new Map();
    this.typedModelIndex.forEach((el) => typeMap.set(el.typeId, el.typeId));
    return Array.from(typeMap.keys());
  }

  public upsertModel(model: Partial<TypedModel>) {
    if (model.typeId == null) {
      throw new Error(`model requires typeId to be defined`);
    }
    if (model.id == null) {
      // new model
      const modelCpy = { ...model, typeId: model.typeId, id: uuidv4() };
      this.typedModelIndex.set(modelCpy.id, modelCpy);
      return { isNew: true, model: modelCpy };
    } else {
      // existing model
      if (this.typedModelIndex.has(model.id) === false) {
        throw new Error(`model with id: '${model.id}' does not exist`);
      }
      const modelCpy = { ...model, typeId: model.typeId, id: model.id };
      this.typedModelIndex.set(modelCpy.id, modelCpy);
      return { isNew: false, model: modelCpy };
    }
  }

  public deleteModelById(id: string): boolean {
    return this.typedModelIndex.delete(id);
  }

  public deleteModelsByTypeId(typeId: string) {
    const modelsToDelete = Array.from(this.typedModelIndex.values()).filter(
      (el) => (el.typeId = typeId)
    );
    for (const model of modelsToDelete) {
      this.deleteModelById(model.id);
    }
    return modelsToDelete?.length > 0 ? true : false;
  }
}
