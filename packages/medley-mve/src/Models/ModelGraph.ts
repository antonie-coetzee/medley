import { TypeMap } from "../Types";
import { Model } from "./Model";

export interface ModelsByTypeId {
  typeId:string;
  models:Model[]
}

export interface ModelGraph {
  typeMap: string | TypeMap;
  modelsByType: ModelsByTypeId[];
}
