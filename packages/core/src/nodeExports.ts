import { NodeContext } from ".";
import { ExecutionContext } from "./Context";
import { Link, Type, Node } from "./core";

export const nodeFunctionExport = "nodeFunction";

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

export const onNodeCreateExport = "onNodeCreate";

export interface OnNodeCreate<
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  (context: NodeContext<TNode, MNode, MType, MLink>): void;
}

export const onNodeUpdateExport = "onNodeUpdate";

export interface OnNodeUpdate<
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  (context: NodeContext<TNode, MNode, MType, MLink>, update: Partial<TNode>): void;
}

export const onNodeDeleteExport = "onNodeDelete";

export interface OnNodeDelete<
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  (context: NodeContext<TNode, MNode, MType, MLink>): void;
}