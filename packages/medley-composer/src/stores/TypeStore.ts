import { Medley, MedleyOptions, Type } from "medley";
import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

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
}
