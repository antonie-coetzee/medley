import { Cache } from "./Cache";
import { Scoped } from "./Scoped";

export interface Node extends Scoped {
  readonly type: string;
  readonly id: string;
  cache?: Cache;
}

export type NodePart<TNode extends Node = Node> = Omit<TNode, "id">;
