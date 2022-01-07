import { Scoped } from "./Scoped";

export interface Node extends Scoped {
  readonly type: string;
  readonly id: string;
}

export type NodePart<TNode extends Node = Node> = Omit<TNode, "id">;