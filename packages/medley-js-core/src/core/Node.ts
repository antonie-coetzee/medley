import { Scoped } from "./Scoped";

export interface Node extends Scoped {
  readonly type: string;
  readonly id: string;
}

export type NodePart<TNode extends Node = Node, MNode extends Node = Node> = {
  [Property in keyof TNode as Exclude<Property, keyof MNode>]: TNode[Property]
};