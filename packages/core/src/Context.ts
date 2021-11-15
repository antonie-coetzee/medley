import { Link, Logger, Node, Type, Port, NodePart, Unwrap } from "./core";
import { Medley } from "./Medley";

type TypeOfPort<T> = T extends Port<infer X> ? X : never;

export type Input = <TypedPort extends Port>(
  port: TypedPort,
  ...args: TypeOfPort<TypedPort> extends (...args: any) => any
    ? Parameters<TypeOfPort<TypedPort>>
    : any[]
) => Promise<Unwrap<TypeOfPort<TypedPort>> | undefined>;

export type BaseContext<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = {
  medley: Medley<MNode, MType, MLink>;
  logger: Logger;
};

export type NodePartContext<
  TNodePart extends NodePart = NodePart,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = BaseContext<MNode, MType, MLink> & {
  node: TNodePart;
};

export type NodeContext<
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = BaseContext<MNode, MType, MLink> & {
  node: TNode;
};

export type ExecutionContext<
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = NodeContext<TNode, MNode, MType, MLink> & {
  input: Input;
};
