import { v4 as uuidv4 } from "uuid";
import { Model, Part, Type, TypedModel } from "./core";

export class ModelRepository {
  public typedModelIndex: Map<string, TypedModel> = new Map();

  constructor() {}

  public load(parts: Part[]): void {
    this.typedModelIndex.clear();
    parts.forEach((part) => {
      const models = part.models;
      models.forEach((model) => {
        const typedModel = { ...model, typeName: part.type.name };
        this.typedModelIndex.set(model.id, typedModel);
      });
    });
  }

  public getModel = (id: string): TypedModel => {
    const model = this.typedModelIndex.get(id);
    if (model == null) throw new Error(`model with id: ${id}, not found`);
    return model;
  };

  public getTypeNameFromModelId(id: string) {
    const model = this.typedModelIndex.get(id);
    return model?.typeName;
  }

  public getModelsByType(typeName: string): TypedModel[] {
    return Array.from(this.typedModelIndex.values()).filter(
      (el) => el.typeName === typeName
    );
  }

  public getModels(): TypedModel[] {
    return Array.from(this.typedModelIndex.values());
  }

  public getUsedTypes(): string[] {
    const typeMap = new Map();
    this.typedModelIndex.forEach((el) => typeMap.set(el.typeName, el.typeName));
    return Array.from(typeMap.keys());
  }

  public upsertModel(model: Partial<TypedModel>) {
    if (model.typeName == null) {
      throw new Error(`model requires typeName to be defined`);
    }
    if (model.id == null) {
      // new model
      const modelCpy = { ...model, typeName: model.typeName, id: uuidv4() };
      this.typedModelIndex.set(modelCpy.id, modelCpy);
      return { isNew: true, model: modelCpy };
    } else {
      // existing model
      if (this.typedModelIndex.has(model.id) === false) {
        throw new Error(`model with id: '${model.id}' does not exist`);
      }
      const modelCpy = { ...model, typeName: model.typeName, id: model.id };
      this.typedModelIndex.set(modelCpy.id, modelCpy);
      return { isNew: false, model: modelCpy };
    }
  }

  public deleteModel(id: string): boolean {
    return this.typedModelIndex.delete(id);
  }

  public deleteModelsByType(typeName: string) {
    const modelsToDelete = Array.from(this.typedModelIndex.values()).filter(
      (el) => el.typeName === typeName
    );
    for (const model of modelsToDelete) {
      this.deleteModel(model.id);
    }
    return modelsToDelete?.length > 0 ? true : false;
  }
}
