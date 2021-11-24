import { BaseContext, NodeContext, NodePartContext } from "@medley-js/core";
import { CLink, CNode, CNodePart, CPort, CType, RType } from "../types";

export type CreateNode<TNode extends CNode = CNode> = (
  context: NodePartContext<CNodePart<TNode>, CNode, CType, CLink>
) => Promise<boolean>;

export interface GetTargetType<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>, portName: string): RType;
}

export type CompareTypesResult = {
  isCompatible:boolean;
  message?:string;
}

export interface GetSourceType<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>): RType;
}

export interface CompareTypes<TNode extends CNode = CNode> {
  (
    context: NodeContext<TNode, CNode, CType, CLink>,
    sourceType: RType,
    targetType: RType
  ): CompareTypesResult;
}
