import { Logger, Node, Port, TypedPort } from "./core";
import { Medley } from "./Medley";

export type PortInput = <Tport>(
  port: TypedPort<Tport>
) => Promise<Tport | undefined>;

export type BasicContext<Tvalue extends unknown = undefined> = {
  medley: Medley;
  logger: Logger;
  node: Node<Tvalue>;
};

export type ExecutionContext<Tvalue extends unknown = undefined> =
  BasicContext<Tvalue> & {
    input: PortInput;
  };
