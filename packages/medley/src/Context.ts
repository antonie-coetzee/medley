import { Logger, Node, TypedPort } from "./core";
import { Medley } from "./Medley";

export type PortInput = <TPort>(
  port: TypedPort<TPort>
) => Promise<TPort | undefined>;

export type BasicContext<TValue extends unknown = undefined> = {
  medley: Medley;
  logger: Logger;
  node: Node<TValue>;
};

export type ExecutionContext<
  TValue extends unknown = undefined
> = BasicContext<TValue> & {
  input: PortInput;
};
