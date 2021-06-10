import { Typed } from ".";

export interface ModelsOfType {
  typeId: string;
  models: Model[];
}

export interface Model {
  id: string;
  name?: string;
  refs?: string[];
  value?: {};
}

export interface TypedModel extends Model, Typed {}
