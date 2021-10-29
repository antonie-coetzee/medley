import { VFC } from "react";
import {
  NodeContext,
} from "@medley-js/core";
import { CLink, CNode, CType, Host } from "../types";

export type TNodeEditComponentProps<TNode extends CNode = CNode> = {
  context: NodeContext<TNode, CNode, CType, CLink>;
  host: Host;
};

export type TNodeEditComponent<TNode extends CNode = CNode> = VFC<
  TNodeEditComponentProps<TNode>
>;
