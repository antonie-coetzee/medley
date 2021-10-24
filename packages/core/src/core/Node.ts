import { Cache } from "./Cache";
import { Scoped } from "./Scoped";

export interface Node<TValue extends unknown = unknown> extends Scoped {
  type: string;
  id: string;
  cache?: Cache;
  value?: TValue;
}

export type NodePart<TNode extends Node = Node> = Omit<TNode, "id">;
