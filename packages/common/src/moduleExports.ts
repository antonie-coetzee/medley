import { CSSProperties, ReactNode, VFC } from "react";
import { BaseContext, NodeContext } from "@medley-js/core";
import { CLink, CNode, CType, CPort } from "primitives";

export type NodeEditComponentProps<TNode extends CNode = CNode> = NodeContext<
  TNode,
  CNode,
  CType,
  CLink
> & {
  edit: {
    onSave?: (saveCallback: () => void) => void;
    openEditComponent?: (nodeId: string) => void;
    stateChanged?: () => void;
  };
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
  selected: boolean;
  sourcePosition: string;
  targetPosition: string;
};

export type GetNodeComponent<TNode extends CNode = CNode> = (
  context: BaseContext<CNode, CType, CLink>
) => Promise<VFC<NodeComponentProps<TNode>>>;

export declare type CPosition = "left" | "top" | "right" | "bottom";

export type GetNodeComponentProps<TNode extends CNode = CNode> = (
  context: NodeContext<TNode, CNode, CType, CLink>
) => Promise<Partial<{
  selectable: boolean;
  draggable: boolean;
  connectable: boolean;
  sourcePosition: CPosition;
  targetPosition: CPosition;
  dragHandle: string;
}>>;

export type GetLinkComponentProps<TNode extends CNode = CNode> = (
  context: NodeContext<TNode, CNode, CType, CLink>
) => Promise<Partial<{
  label: string | ReactNode;
  labelStyle: CSSProperties;
  labelShowBg: boolean;
  labelBgStyle: CSSProperties;
  labelBgPadding: [number, number];
  labelBgBorderRadius: number;
  style: CSSProperties;
  animated: boolean;
  isHidden: boolean;
  className: string;
}>>;

export type GetPorts<TNode extends CNode = CNode> = (
  context: NodeContext<TNode, CNode, CType, CLink>
) => Promise<CPort[]>;

export const onNodeCreateExport = "onNodeCreate";

export interface OnNodeCreate<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>): void;
}

export const onNodeUpdateExport = "onNodeUpdate";

export interface OnNodeUpdate<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>, update: Partial<TNode>): void;
}

export const onNodeDeleteExport = "onNodeDelete";

export interface OnNodeDelete<TNode extends CNode = CNode> {
  (context: NodeContext<TNode, CNode, CType, CLink>): void;
}

export type MType = {
  typeSystem: string;
  type: unknown;
};

export type GetPortType<TNode extends CNode> = (
  context: NodeContext<TNode, CNode, CType, CLink>,
  port: CPort
) => MType;

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
