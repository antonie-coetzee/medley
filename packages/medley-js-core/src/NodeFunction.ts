import { ExecutionContext } from "./Context";
import { Node } from "./core";
import { MedleyTypes } from "./MedleyTypes";

export const nodeFunction = "nodeFunction";

export interface NodeFunction<
  TNode extends MT["node"] = Node,
  MT extends MedleyTypes = MedleyTypes
> {
  (context: ExecutionContext<TNode, MT>, ...args: any[]): any;
}

export type NF<
  TNode extends MT["node"] = Node,
  MT extends MedleyTypes = MedleyTypes
> = NodeFunction<TNode, MT>;
