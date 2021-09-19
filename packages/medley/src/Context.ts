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
  input: Input;
};
