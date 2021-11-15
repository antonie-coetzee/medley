import { ExecutionContext } from "./Context";
import { Link, Type, Node } from "./core";

export const nodeFunction = "nodeFunction";

export interface NodeFunction<
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  (
    context: ExecutionContext<TNode, MNode, MType, MLink>,
    ...args: any[]
  ): any;
}

export type NF<
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = NodeFunction<TNode, MNode, MType, MLink>;