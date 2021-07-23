import { Model, Part, Type, TypedModel } from "./core";

export class ModelRepository {
  public mainModelId?:string;
  public typedModelIndex: Map<string, TypedModel> = new Map();

  constructor() {}

  public load(parts: Part[]): void {
    this.typedModelIndex.clear();
    parts.forEach((part) => {
      const models = part.models;
      models.forEach((model) => {
        const typedModel = { ...model, typeName: part.type.name };
        this.typedModelIndex.set(model.id, typedModel);
        if(model.main === true){
          if(this.mainModelId){
            throw new Error("multiple main models defined");
          }
          this.mainModelId = model.id;
        }
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

  public getMainModel(): Model | undefined {
    if(this.mainModelId){
      return this.typedModelIndex.get(this.mainModelId);
    }
  }

  public setMainModel(id: string) {
    const model = this.getModel(id);
    const currentMainModel = this.getMainModel();
    if(currentMainModel){
      delete currentMainModel.main;
    }
    this.mainModelId = model.id;
    model.main = true;
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
      let newId:string;
      do {        
        newId = this.generateId();
      } while (this.typedModelIndex.has(newId));
      const modelCpy = { ...model, typeName: model.typeName, id: newId };
      this.typedModelIndex.set(modelCpy.id, modelCpy);
      return { isNew: true, model: modelCpy };
    } else {
      // existing model
      const existingModel = this.typedModelIndex.get(model.id);
      if (existingModel == null) {
        throw new Error(`model with id: '${model.id}' does not exist`);
      }
      const updatedModel = {...existingModel, ...model};
      this.typedModelIndex.set(updatedModel.id, updatedModel);
      return { isNew: false, model: updatedModel };
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

  // 8,361,453,672 possible combinations, at a 1000 IDs per hour/second, ~87 days needed, in order to have a 1% probability of at least one collision
  private generateId() {
    const alphanumeric = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const length = 8;
    var result = '';
    for (var i = 0; i < length; ++i) {
      result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    }
    return result;
  };
}
