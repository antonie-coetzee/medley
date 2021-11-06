import { NodeContext, NodePartContext } from "@medley-js/core";
import { CLink, CNode, CNodePart, CPort, CType } from "./types";

export type CreateNode<TNode extends CNode = CNode> = (
    context: NodePartContext<CNodePart<TNode>, CNode, CType, CLink>
  ) => Promise<boolean>;

export type GetPorts<TNode extends CNode = CNode> = (
    context: NodeContext<TNode, CNode, CType, CLink>
  ) => Promise<CPort[]>;
  