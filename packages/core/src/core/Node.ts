import { Scoped } from "./Scoped";

export interface Node<TValue extends unknown = unknown> extends Scoped {
  type: string;
  id: string;
  cache?: boolean;
  value?: TValue;
}
