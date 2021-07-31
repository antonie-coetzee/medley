import { Logger, TypedNode } from "./core";
import { Medley } from "./Medley";

export type ReturnedPromiseType<T> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : never;

export type PortDefinition<T extends (...args: any) => any> = {
  name: string;
  shape?: T;
};

export type PortInput = <T extends (...args: any) => any>(
  portDefinition: PortDefinition<T>,
  ...args: Parameters<T>
) => Promise<ReturnedPromiseType<T> | undefined>;

export type PortInputMultiple = <T extends (...args: any) => any>(
  portDefinition: PortDefinition<T>,
  ...args: Parameters<T>
) => Promise<ReturnedPromiseType<T>[] | undefined>;

export type Context = {
  medley: Medley & {
    logger: Logger;
    node: TypedNode;
    port: {
      single: PortInput;
      multiple: PortInputMultiple;
      instances: {[portName: string]: string[] | undefined}
    }
  };
};
