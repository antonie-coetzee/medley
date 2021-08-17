import {Context} from "./Context"
import { Port } from "./core";

export interface NodeFunction<T = {}> {
  (this:T & Context, ...args:any) : any;
  ports?:Port[];
}
