import { v4 as uuidv4 } from "uuid";
import { Model, ModelsByType, TypedModel } from "./core";

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
  }

  public getTypeIdFromModelId(id: string){
    const model = this.typedModelIndex.get(id);
    return model?.typeId;
  }

  public getModelsByTypeId(typeId: string): TypedModel[] {
    return Array.from(this.typedModelIndex.values()).filter(el=>el.typeId === typeId);
  }

  public getModels(): TypedModel[] {
    return Array.from(this.typedModelIndex.values());
  }

  public getUsedTypeIds(): string[] {
    const typeMap = new Map();
    this.typedModelIndex.forEach(el=>typeMap.set(el.typeId,el.typeId));
    return Array.from(typeMap.keys());
  }

  public upsertModel(model: TypedModel){
    const isNew = this.typedModelIndex.has(model.id);
    this.typedModelIndex.set(model.id, model);
    return isNew;
  }

  public deleteModelById(id: string): boolean {
    return this.typedModelIndex.delete(id);
  }

  public deleteModelsByTypeId(typeId: string){
    const modelsToDelete = Array.from(this.typedModelIndex.values()).filter(el=>el.typeId = typeId);
    for(const model of modelsToDelete){
      this.deleteModelById(model.id);   
    }
    return modelsToDelete?.length > 0 ? true : false;
  }
}
