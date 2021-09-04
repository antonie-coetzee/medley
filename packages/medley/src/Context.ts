import { Link, Logger, Node, Type, TypedPort } from "./core";
import { Medley } from "./Medley";

export type PortInput = <TPort>(
  port: TypedPort<TPort>
) => Promise<TPort | undefined>;

export type BasicContext<
TNode extends Node = Node,
TType extends Type = Type,
TLink extends Link = Link
> = {
  medley: Medley<TNode, TType, TLink>;
  logger: Logger;
  node: TNode;
};

export type ExecutionContext<
TNode extends Node = Node,
TType extends Type = Type,
TLink extends Link = Link
> = BasicContext<TNode, TType, TLink> & {
  input: PortInput;
};
