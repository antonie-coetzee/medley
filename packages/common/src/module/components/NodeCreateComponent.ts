import { VFC } from "react";
import { NodePartContext } from "@medley-js/core";
import { CLink, CNode, CNodePart, CType, Host } from "../types";

export type TNodeCreateComponentProps<
  TNodePart extends CNodePart = CNodePart
> = {
  context: NodePartContext<TNodePart, CNode, CType, CLink>;
  host: Host;
  create: (nodePart: TNodePart) => void;
};

export type TNodeCreateComponent<TNodePart extends CNodePart = CNodePart> = VFC<
  TNodeCreateComponentProps<TNodePart>
>;
