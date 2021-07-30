import { Type, Typed } from "./Type";

export interface Node {
  id: string;
  name?: string;
  value?: any;
}

export interface TypedNode extends Node, Typed {}

