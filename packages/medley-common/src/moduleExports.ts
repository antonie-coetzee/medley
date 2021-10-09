import { ReactNode } from "react";
import { BaseContext } from "medley";
import { CLink, CNode, CType, CPort } from "primitives";

export type GetNodeEditComponent<TNode extends CNode = CNode> = (
  context: BaseContext<TNode, CType, CLink> & {
    onSave: (saveCallback: () => void) => void;
    stateChanged: () => void;
  }
) => Promise<ReactNode>;

export type GetNodeComponent<TNode extends CNode = CNode> = (
  context: BaseContext<TNode, CType, CLink>
) => Promise<ReactNode>;

export interface GetPorts<
  TNode extends CNode = CNode
> {
  (context: BaseContext<TNode, CType, CLink>): CPort[];
}

export type MType = {
  typeSystem: string;
  type: unknown;
};

export interface GetPortType<TNode extends CNode> {
  (context: BaseContext<TNode, CType, CLink>, port: CPort): MType;
}

export interface GetNodeType<TNode extends CNode> {
  (context: BaseContext<TNode, CType, CLink>): MType;
}

export interface CompareTypes<TNode extends CNode> {
  (
    context: BaseContext<TNode, CType, CLink>,
    type1: MType,
    type2: MType
  ): boolean;
}

export type EventResult = {
  errorMessage?: string;
} | void;

export interface OnAddLink<TNode extends CNode> {
  (context: BaseContext<TNode, CType, CLink>, link: CLink): EventResult;
}

export interface OnAddNode<TNode extends CNode> {
  (context: BaseContext<TNode, CType, CLink>): EventResult;
}

export interface OnDeleteNode<TNode extends CNode> {
  (context: BaseContext<TNode, CType, CLink>): EventResult;
}
