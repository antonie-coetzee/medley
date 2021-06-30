import { Type, Typed } from "./Type";

export interface Model {
  id: string;
  name?: string;
  refs?: string[];
  value?: {};
}

export interface TypedModel extends Model, Typed {}

