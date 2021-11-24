import { VFC } from "react";
import { NodePartContext } from "@medley-js/core";
import { CLink, CNode, CNodePart, CType, Host } from "../../types";

export type TCreateNodeComponentProps<
  TNodePart extends CNodePart = CNodePart
> = {
  context: NodePartContext<TNodePart, CNode, CType, CLink>;
  host: Host;
  close: (construct:boolean) => void;
};

export type TCreateNodeComponent<TNode extends CNode = CNode> = VFC<
  TCreateNodeComponentProps<CNodePart<TNode>>
>;
