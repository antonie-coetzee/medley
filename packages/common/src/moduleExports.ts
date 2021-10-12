import { ReactNode, VFC } from "react";
import { BaseContext, NodeContext } from "medley";
import { CLink, CNode, CType, CPort } from "primitives";

export type NodeEditComponentProps<TNode extends CNode = CNode> = NodeContext<
  TNode,
  CNode,
  CType,
  CLink
> & {
  onSave: (saveCallback: () => void) => void;
  stateChanged: () => void;
};

export type GetNodeEditComponent<TNode extends CNode = CNode> = (
  context: NodeContext<TNode, CNode, CType, CLink> 
) => Promise<VFC<NodeEditComponentProps<TNode>>>;

export type NodeComponentProps<TNode extends CNode = CNode> = NodeContext<
  TNode,
  CNode,
  CType,
  CLink
> & {
  selected: boolean,
  sourcePosition: string,
  targetPosition: string
};

export type GetNodeComponent = (
  context: BaseContext<CNode, CType, CLink>
) => Promise<VFC<NodeComponentProps<CNode>>>;

export type GetNodeModifiers<TNode extends CNode = CNode> = (
  context: NodeContext<TNode, CNode, CType, CLink>
) => Promise<ReactNode>;

export interface GetPorts<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>): CPort[];
}

export type MType = {
  typeSystem: string;
  type: unknown;
};

export interface GetPortType<TNode extends CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>, port: CPort): MType;
}

export interface GetNodeType<TNode extends CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>): MType;
}

export interface CompareTypes<TNode extends CNode> {
  (
    context: NodeContext<TNode, CNode, CType, CLink>,
    type1: MType,
    type2: MType
  ): boolean;
}

export type EventResult = {
  errorMessage?: string;
} | void;

export interface OnAddLink<TNode extends CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>, link: CLink): EventResult;
}

export interface OnAddNode<TNode extends CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>): EventResult;
}

export interface OnDeleteNode<TNode extends CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>): EventResult;
}
