import React, { ReactNode } from "react";
import { BaseContext, Link, Node, Port, Type } from "medley";

export type NodeEditComponentProps<TNode extends Node = Node> = BaseContext<TNode> & {
  onSave: (saveCallback: () => void) => void;
  isChanged: () => void;
};

export type NodeEditComponent<TNode extends Node = Node> = React.FC<
  NodeEditComponentProps<TNode>
>;

export interface GetNodeEditComponent<TNode extends Node = Node> {
  (): NodeEditComponent<TNode>;
}

export interface GetNodeComponent {
  (): ReactNode;
}

export interface GetPorts<
  TNode extends Node = Node,
  TPort extends Port = Port
> {
  (context: BaseContext<TNode>): TPort[];
}

export type MType = {
  typeSystem: string;
  type: unknown;
};

export interface getPortType<
  TNode extends Node = Node,
  TPort extends Port = Port
> {
  (context: BaseContext<TNode>, port: TPort): MType;
}

export interface getNodeType<TNode extends Node = Node> {
  (context: BaseContext<TNode>): MType;
}

export interface compareTypes<TNode extends Node = Node> {
  (context: BaseContext<TNode>, type1: MType, type2: MType): boolean;
}

export type EventResult = {
  errorMessage?: string;
} | void;

export interface onAddLink<
  TNode extends Node = Node,
  TLink extends Link = Link
> {
  (context: BaseContext<TNode, Type, TLink>, link: TLink): EventResult;
}

export interface onDeleteLink<
  TNode extends Node = Node,
  TLink extends Link = Link
> {
  (context: BaseContext<TNode, Type, TLink>, link: TLink): EventResult;
}

export interface onAddNode<TNode extends Node = Node> {
  (context: BaseContext<TNode>): EventResult;
}

export interface onDeleteNode<TNode extends Node = Node> {
  (context: BaseContext<TNode>): EventResult;
}