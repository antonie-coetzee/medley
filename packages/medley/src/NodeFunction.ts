import { BasicContext, RuntimeContext } from "./Context";
import { Port } from "./core";

export interface NodeFunction<T = {}> {
  (context: T & RuntimeContext, ...args: any[]): any;
  ports?: (context: BasicContext) => Port[];
}

export type NF<T = {}> = NodeFunction<T>;
