import { Logger, TypedNode } from "./core";
import { Medley } from "./Medley";

export type ReturnedPromiseType<T> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : never;

export type ReturnedPromiseTypeArray<T> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R[]
  : never;

export type PortInputFunction = <T extends (...args: any) => any>(
  portName: string,
  ...args: Parameters<T>
) => Promise<ReturnedPromiseType<T> | undefined>;

export type PortInputMultipleFunction = <T extends (...args: any) => any>(
  portName: string,
  ...args: Parameters<T>
) => Promise<ReturnedPromiseType<T>[] | undefined>;

export type Context = {
  medley: Medley & {
    logger: Logger;
    node: TypedNode;
    portInput: PortInputFunction;
    portInputMultiple: PortInputMultipleFunction;
  };
};
