import { ExecutionContext } from "./Context";
import { Link, Type, Node, BaseTypes } from "./core";

export const nodeFunction = "nodeFunction";

export interface NodeFunction<
  TNode extends BT["node"] = Node,
  BT extends BaseTypes = BaseTypes
> {
  (
    context: ExecutionContext<TNode, BT>,
    ...args: any[]
  ): any;
}

export type NF<
  TNode extends BT["node"] = Node,
  BT extends BaseTypes = BaseTypes
> = NodeFunction<TNode, BT>;