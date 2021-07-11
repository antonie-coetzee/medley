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

  getValueSchema(typeName:string){
    return this.medley.getExportFromType<string>(typeName, VALUE_SCHEMA);
  }
}
