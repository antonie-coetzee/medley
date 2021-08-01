import { Typed } from "./Type";

export interface Node extends Typed {
  id: string;
  name?: string;
  value?: any;
}
