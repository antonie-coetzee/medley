import { Typed } from "./Typed";

export interface Model {
  id: string;
  name?: string;
  refs?: string[];
  value?: {};
}

export interface TypedModel extends Model, Typed {}

export interface ModelsByType extends Typed {
  models: Model[];
}