import { Medley, MedleyOptions, Type } from "medley";
import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import React from "react";

const VALUE_SCHEMA = "valueSchema";
const EDIT_COMPONENT = "EditComponent";
const UI_SCHEMA = "uiSchema";

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
  }

  getValueSchema(typeName:string){
    return this.medley.getExportFromType<string>(typeName, VALUE_SCHEMA);
  }

  getEditComponent(typeName:string){
    return this.medley.getExportFromType<React.FC>(typeName, EDIT_COMPONENT);
  }

  getUiSchema(typeName:string){
    return this.medley.getExportFromType<string>(typeName, UI_SCHEMA);
  }
}
