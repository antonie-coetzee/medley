import { VFC } from "react";
import { NodePartContext } from "@medley-js/core";
import { CLink, CNode, CNodePart, CType, Host } from "../types";

export type TNodeConstructComponentProps<
  TNodePart extends CNodePart = CNodePart
> = {
  context: NodePartContext<TNodePart, CNode, CType, CLink>;
  host: Host;
  close: (construct:boolean) => void;
};

export type TNodeConstructComponent<TNode extends CNode = CNode> = VFC<
  TNodeConstructComponentProps<CNodePart<TNode>>
>;
