import { Typed } from "../Core";

export interface ModelsByTypeId {
    typeId:string;
    models:Model[]
  }

export interface Model {
    id:string;
    name:string;
    refs?:string[];
    value?:any;
}

export interface TypedModel extends Model, Typed {}