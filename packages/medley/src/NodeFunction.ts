import { BasicContext, ExecutionContext } from "./Context";
import { Link, Port } from "./core";

export interface NodeFunction<TContext extends {} = {}, TValue extends unknown = undefined> {
  (context: TContext & ExecutionContext<TValue>, ...args: any[]): any;
}

export type NF<T = {}> = NodeFunction<T>;
