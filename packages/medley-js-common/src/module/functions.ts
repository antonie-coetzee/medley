import { BaseContext, NodeContext, NodePartContext } from "@medley-js/core";
import { CMedleyTypes, CLink, CNode, CNodePart, CPort, CType, RType } from "../types";

export type CreateNode<TNode extends CNode = CNode> = (
  context: NodePartContext<CNodePart<TNode>, CMedleyTypes>
) => Promise<boolean>;

export interface GetTargetType<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CMedleyTypes>, portName: string): RType;
}

export type CompareTypesResult = {
  isCompatible:boolean;
  message?:string;
}

export interface GetSourceType<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CMedleyTypes>): RType;
}

export interface CompareTypes<TNode extends CNode = CNode> {
  (
    context: NodeContext<TNode, CMedleyTypes>,
    sourceType: RType,
    targetType: RType
  ): CompareTypesResult;
}
