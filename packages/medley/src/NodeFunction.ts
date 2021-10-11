import { ExecutionContext } from "./Context";
import { Link, Type, Node } from "./core";

export const nodeFunctionExportName = "nodeFunction";

export interface NodeFunction<
  TContext extends {} = {},
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  (context: TContext & ExecutionContext<TNode, MNode, MType, MLink>, ...args: any[]): any;
}

export type NF<
  TContext extends {} = {},
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = NodeFunction<TContext, TNode, MNode, MType, MLink>;
