import { Medley, TypedModel } from "medley"
import { makeObservable, observable, runInAction } from "mobx";

export class ModelStore {
  typeModelMap:Map<string, TypedModel[]> = new Map();
  modelUpdates:Map<string, TypedModel> = new Map();

  constructor(private medley: Medley) {
    makeObservable(this, {typeModelMap: observable, modelUpdates: observable});
    medley.updateOptions({
      eventHooks: { modelsOfTypeUpdate: (type,models) => {
        runInAction(()=>{
          this.typeModelMap.set(type.name, models);
        })       
      }},
    });
    medley.updateOptions({
      eventHooks: { modelUpdate: (type,model) => {
        runInAction(()=>{
          this.modelUpdates.set(model.id, model);
        })       
      }},
    });    
  }

  public getModelsByTypeId(typeName: string): TypedModel[] {
    return this.medley.getModelsByType(typeName);
  }

  public getModelById(modelId: string): TypedModel {
    return this.modelUpdates.get(modelId) || this.medley.getTypedModel(modelId);
  }

  public upsertModel(model: Partial<TypedModel>) {
    return this.medley.upsertTypedModel(model);
  }

  public copyModel(newName:string, model: TypedModel) {
    const modelCopy =  JSON.parse(JSON.stringify(model)) as Partial<TypedModel>;
    modelCopy.name = newName;
    delete modelCopy.id
    this.medley.upsertTypedModel(modelCopy);
  }
}
