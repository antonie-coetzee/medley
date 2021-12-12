import { VFC } from "react";
import { NodeContext } from "@medley-js/core";
import { CMedleyTypes, CNode, Host } from "../../types";

export type TEditNodeComponentProps<TNode extends CNode = CNode> = {
  context: NodeContext<TNode, CMedleyTypes>;
  host: Host;
  close: () => void;
};

export type TEditNodeComponent<TNode extends CNode = CNode> = VFC<
  TEditNodeComponentProps<TNode>
>;
