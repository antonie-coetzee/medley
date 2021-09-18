import {
  Link,
  Logger,
  PortMultiple,
  Node,
  Type,
  PortSingle,
  Port,
} from "./core";
import { Medley } from "./Medley";

type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T;

type typedPortOf<T> = T extends PortSingle<infer X>
  ? X
  : T extends PortMultiple<infer Y>
  ? Y
  : never;

export type Input = <
  TPort extends Port
>(
  port: TPort,
  ...args: typedPortOf<TPort> extends (...args: any) => any
    ? Parameters<typedPortOf<TPort>>
    : any[]
) => typedPortOf<TPort> extends (...args: any) => any
  ? TPort extends PortMultiple<typedPortOf<TPort>>
    ? Promise<Unwrap<typedPortOf<TPort>>[] | undefined>
    : Promise<Unwrap<typedPortOf<TPort>> | undefined>
  : TPort extends PortMultiple<typedPortOf<TPort>>
  ? Promise<Unwrap<typedPortOf<TPort>>[] | undefined>
  : Promise<Unwrap<typedPortOf<TPort>> | undefined>;

//export type Input<TPort extends unknown = unknown> = TPort extends (...args: any) => any ? FuncInput : BasicInput;

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
