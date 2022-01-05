import { BaseContext, NodeContext, NodePartContext } from "@medley-js/core";
import { CMedleyTypes, CNode, CNodePart, RType } from "../types";

export type NodeConstructor<TNode extends CNode = CNode> = (
  context: BaseContext<CMedleyTypes>
) => Promise<CNodePart<TNode> | void>;

export interface TargetType<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CMedleyTypes>, portName: string): RType;
}

export type CompareTypesResult = {
  isCompatible: boolean;
  message?: string;
};

export interface SourceType<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CMedleyTypes>): RType;
}

export interface CompareTypes<TNode extends CNode = CNode> {
  (
    context: NodeContext<TNode, CMedleyTypes>,
    sourceType: RType,
    targetType: RType
  ): CompareTypesResult;
}
