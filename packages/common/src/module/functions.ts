import { NodeContext, NodePartContext } from "@medley-js/core";
import { CLink, CNode, CNodePart, CPort, CType } from "./types";

export type NodeConstruct<TNodePart extends CNodePart = CNodePart> = (
    context: NodePartContext<TNodePart, CNode, CType, CLink>
  ) => Promise<boolean>;

export type GetPorts<TNode extends CNode = CNode> = (
    context: NodeContext<TNode, CNode, CType, CLink>
  ) => Promise<CPort[]>;
  