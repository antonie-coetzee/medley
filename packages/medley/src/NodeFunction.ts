import { ExecutionContext } from "./Context";

export interface NodeFunction<
  TContext extends {} = {},
  TValue extends unknown = undefined
> {
  (context: TContext & ExecutionContext<TValue>, ...args: any[]): any;
}

export type NF<T = {}> = NodeFunction<T>;
