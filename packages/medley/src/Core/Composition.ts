import {Model, Type} from ".";

export interface Composition {
  mainModelId?:string;
  parts: Part[];
}

export interface Part{
  type: Type;
  models: Model[];
}
