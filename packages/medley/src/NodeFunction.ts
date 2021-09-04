import { ExecutionContext } from "./Context";
import { Link, Type, Node } from "./core";

export interface NodeFunction<
  TContext extends {} = {},
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  (context: TContext & ExecutionContext<TNode, TType, TLink>, ...args: any[]): any;
}

export type NF<
  TContext extends {} = {},
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> = NodeFunction<TContext, TNode, TType, TLink>;
