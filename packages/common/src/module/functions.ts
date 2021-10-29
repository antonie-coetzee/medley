import { NodeContext, NodePartContext } from "@medley-js/core";
import { CLink, CNode, CNodePart, CPort, CType } from "./types";

export type NodeCreate<TNodePart extends CNodePart = CNodePart> = (
    context: NodePartContext<TNodePart, CNode, CType, CLink>
  ) => Promise<void>;


export type GetPorts<TNode extends CNode = CNode> = (
    context: NodeContext<TNode, CNode, CType, CLink>
  ) => Promise<CPort[]>;
  