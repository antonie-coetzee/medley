import { Model, Part, Type, TypedModel } from "./core";

export class ModelRepository {
  private relations: Map<string /*id*/, string[] /*referenced by*/> = new Map();
  public typedModelIndex: Map<string, TypedModel> = new Map();

  constructor() {}

  public load(parts: Part[]): void {
    this.relations.clear();
    this.typedModelIndex.clear();
    parts.forEach((part) => {
      const models = part.models;
      models.forEach((model) => {
        const typedModel = { ...model, typeName: part.type.name };
        typedModel.refs?.forEach((ref) => {
          this.addRelation(model.id, ref);
        });
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
      let newId: string;
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
      const updatedModel = { ...existingModel, ...model };
      this.typedModelIndex.set(updatedModel.id, updatedModel);
      return { isNew: false, model: updatedModel };
    }
  }

  public getReferences(modelId:string){
    return this.relations.get(modelId);
  }

  public deleteModel(id: string): boolean {
    if(this.relations.has(id)){
      throw new Error(`model with id: '${id}' is referenced and cannot be deleted`)
    }
    return this.typedModelIndex.delete(id);
  }

  public deleteModelsByType(typeName: string) {
    const modelsToDelete = Array.from(this.typedModelIndex.values()).filter(
      (el) => el.typeName === typeName
    );
    // check if all models can be deleted - not referenced
    modelsToDelete.forEach(m=>this.checkRelation(m.id));
    // safe to delete
    modelsToDelete.forEach(m=>this.deleteModel(m.id));
    return modelsToDelete?.length > 0 ? true : false;
  }

  private checkRelation(modelId:string){
    if(this.relations.has(modelId)){
      throw new Error(`model with id: '${modelId}' is being referenced and cannot be deleted`);
    }
  }

  private addRelation(modelId:string, refId:string){
    const referencedBy = this.relations.get(refId);
    if(referencedBy){
      referencedBy.push(modelId);
    }else{
      this.relations.set(refId,[modelId]);
    }  
  }

  private deleteRelation(modelId:string, refId:string){
    const belongsTo = this.relations.get(refId);  
    if(belongsTo){
      const index = belongsTo.indexOf(modelId)
      if(index > -1){
        belongsTo.splice(belongsTo.indexOf(modelId), 1); 
      }
      if(belongsTo.length === 0){
        this.relations.delete(refId);
      }    
    }
  }

  // 8,361,453,672 possible combinations, at a 1000 IDs per hour/second, ~87 days needed, in order to have a 1% probability of at least one collision
  private generateId() {
    const alphanumeric =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const length = 8;
    var result = "";
    for (var i = 0; i < length; ++i) {
      result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    }
    return result;
  }
}
