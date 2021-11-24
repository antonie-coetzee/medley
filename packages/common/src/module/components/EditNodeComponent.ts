import { VFC } from "react";
import { NodeContext } from "@medley-js/core";
import { CLink, CNode, CType, Host } from "../../types";

export type TEditNodeComponentProps<TNode extends CNode = CNode> = {
  context: NodeContext<TNode, CNode, CType, CLink>;
  host: Host;
  close: () => void;
};

export type TEditNodeComponent<TNode extends CNode = CNode> = VFC<
  TEditNodeComponentProps<TNode>
>;
