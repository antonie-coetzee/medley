import { Medley, TypedModel } from "medley"
import { makeObservable, observable, runInAction } from "mobx";

export class ModelStore {
  typeModelMap:Map<string, TypedModel[]>  = new Map();

  constructor(private medley: Medley) {
    makeObservable(this, {typeModelMap: observable});
    medley.updateOptions({
      eventHooks: { modelsOfTypeUpdate: (type,models) => {
        runInAction(()=>{
          this.typeModelMap.set(type.name, models);
        })       
      }},
    });
  }

  public getModelsByTypeId(typeName: string): TypedModel[] {
    return this.medley.getModelsByType(typeName);
  }

  public getModelById(modelId: string): TypedModel {
    return this.medley.getTypedModel(modelId);
  }

  public upsertModel(model: Partial<TypedModel>) {
    return this.medley.upsertTypedModel(model);
  }
}
