import { Link, Logger, MultiPort, Node, Type, UniPort, Port } from "./core";
import { Medley } from "./Medley";

type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T;

type TypeOfPort<T> = T extends UniPort<infer X>
  ? X
  : T extends MultiPort<infer Y>
  ? Y
  : never;

export type Input = <TypedPort extends Port>(
  port: TypedPort,
  ...args: TypeOfPort<TypedPort> extends (...args: any) => any
    ? Parameters<TypeOfPort<TypedPort>>
    : any[]
) => TypedPort extends MultiPort<TypeOfPort<TypedPort>>
  ? Promise<Unwrap<TypeOfPort<TypedPort>>[] | undefined>
  : Promise<Unwrap<TypeOfPort<TypedPort>> | undefined>;

export type BaseContext<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = {
  medley: Medley<MNode, MType, MLink>;
  logger: Logger;
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
