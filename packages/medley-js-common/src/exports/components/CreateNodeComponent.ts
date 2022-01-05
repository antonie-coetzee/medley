import { NodePartContext } from "@medley-js/core";
import { VFC } from "react";
import { CMedleyTypes, CNode, CNodePart, Host } from "../../types";

export type TCreateNodeComponentProps<
  TNodePart extends CNodePart = CNodePart
> = {
  context: NodePartContext<TNodePart, CMedleyTypes>;
  host: Host;
  close: (construct: boolean) => void;
};

export type TCreateNodeComponent<TNode extends CNode = CNode> = VFC<
  TCreateNodeComponentProps<CNodePart<TNode>>
>;
