import { Typed } from "./Type";

export interface Node extends Typed {
  id: string;
  cache?: boolean;
  name?: string;
  value?: any;
}