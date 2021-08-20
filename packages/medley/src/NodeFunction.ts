import { BasicContext, ExecutionContext } from "./Context";
import { Link, Port } from "./core";

export interface NodeEdit<Tvalue extends unknown = undefined> {
  portGetType?: (context: BasicContext<Tvalue>, port: Port) => unknown;
  portIsType?: (context: BasicContext<Tvalue>, port: Port, type: unknown) => boolean;
  portAddLink?: (context: BasicContext<Tvalue>, port: Port, link: Link) => void;
  portRemoveLink?: (context: BasicContext<Tvalue>, port: Port, link: Link) => void;
}

export interface NodeFunction<Tcontext extends {} = {}, Tvalue extends unknown = undefined> {
  (context: Tcontext & ExecutionContext<Tvalue>, ...args: any[]): any;
  ports?: (context: BasicContext<Tvalue>) => Port[];
}

export type NF<T = {}> = NodeFunction<T>;
