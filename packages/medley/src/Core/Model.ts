import { Typed } from ".";

export interface ModelsOfType {
  typeId: string;
  models: Model[];
}

export interface Model {
  id: string;
  name?: string;
  references?: string[];
  value?: any;
}

export interface TypedModel extends Model, Typed {}
