import { VFC } from "react";
import {
  NodeContext
} from "@medley-js/core";
import { CLink, CNode, CType, Host } from "../types";

export type TNodeComponentProps<TNode extends CNode = CNode> = {
  context: NodeContext<TNode, CNode, CType, CLink>;
  host: Host;
  selected: boolean;
};

export type TNodeComponent<TNode extends CNode = CNode> = VFC<
  TNodeComponentProps<TNode>
>;
