import { BaseContext, NodeContext } from "@medley-js/core";
import { CMedleyTypes, CNode, CNodeData, RType } from "../types";

export type NodeConstructor<TNode extends CNode = CNode> = (
  context: BaseContext<CMedleyTypes>
) => Promise<CNodeData<TNode> | void>;

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
