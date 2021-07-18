import { Type, Typed } from "./Type";

export interface Model {
  id: string;
  name?: string;
  refs?: string[];
  value?: {};
  main?:boolean;
}

export interface TypedModel extends Model, Typed {}

