import { Medley, MedleyOptions, Type } from "medley";
import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

const VALUE_SCHEMA = "valueSchema";

export class TypeStore {
  typesActive: Type[] = [];

  constructor(private medley: Medley) {
    makeObservable(this, {typesActive: observable.shallow});
    medley.updateOptions({
      eventHooks: { typesUpdate: (types: Type[]) => {
        runInAction(()=>{
          this.typesActive = types;
        })       
      }},
    });
    this.typesActive = medley.getTypes();
  }

  getValueSchema(typeId:string){
    return this.medley.getExportFromTypeId<string>(typeId, VALUE_SCHEMA);
  }
}
