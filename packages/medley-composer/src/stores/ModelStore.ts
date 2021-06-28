import { Medley, TypedModel } from "medley"
import { observable } from "mobx";

export class ModelStore {
  constructor(private medley: Medley) {}

  public getModelsByTypeId(typeId: string): TypedModel[] {
    return this.medley.getModelsByTypeId(typeId);
  }

  public upsertModel(model: Partial<TypedModel>) {
    return this.medley.upsertTypedModel(model);
  }
}
