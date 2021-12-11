import { BaseContext, NodeContext, NodePartContext } from "@medley-js/core";
import { CBaseTypes, CLink, CNode, CNodePart, CPort, CType, RType } from "../types";

export type CreateNode<TNode extends CNode = CNode> = (
  context: NodePartContext<CNodePart<TNode>, CBaseTypes>
) => Promise<boolean>;

export interface GetTargetType<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CBaseTypes>, portName: string): RType;
}

export type CompareTypesResult = {
  isCompatible:boolean;
  message?:string;
}

export interface GetSourceType<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CBaseTypes>): RType;
}

export interface CompareTypes<TNode extends CNode = CNode> {
  (
    context: NodeContext<TNode, CBaseTypes>,
    sourceType: RType,
    targetType: RType
  ): CompareTypesResult;
}
