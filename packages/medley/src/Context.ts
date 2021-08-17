import { Logger, Node, Port, TypedPort } from "./core";
import { Medley } from "./Medley";

export type PortInput = <T>(port: TypedPort<T>, instance?: string) => Promise<T | undefined>;

export type BasicContext = {
  medley: Medley;
  logger: Logger;
  node: Node;
};

export type RuntimeContext = BasicContext & {
  port: {
    input: PortInput;
    instances: <T>(port: Port) => string[] | undefined;
  };
};
