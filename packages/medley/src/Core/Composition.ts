import {Model, Type} from ".";

export interface Composition {
  parts: Part[];
}

export interface Part{
  type: Type;
  models: Model[];
}
