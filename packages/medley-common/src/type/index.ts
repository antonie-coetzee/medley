import React from "react";
import { BasicContext, Link, Medley, Node, Port, Type } from "medley";

export type EditNodeComponentProps<TNode extends Node = Node> = {
  medley: Medley<TNode>;
  node: TNode;
  onSave: (saveCallback: () => void) => void;
  isChanged: () => void;
};

export type EditNodeComponent<TNode extends Node = Node> = React.FC<
  EditNodeComponentProps<TNode>
>;

export interface getEditNodeComponent<TNode extends Node = Node> {
  (): EditNodeComponent<TNode>;
}

export interface getPorts<
  TNode extends Node = Node,
  TPort extends Port = Port
> {
  (context: BasicContext<TNode>): TPort[];
}

export type MType = {
  typeSystem: string;
  type: unknown;
};

export interface getPortType<
  TNode extends Node = Node,
  TPort extends Port = Port
> {
  (context: BasicContext<TNode>, port: TPort): MType;
}

export interface getNodeType<TNode extends Node = Node> {
  (context: BasicContext<TNode>): MType;
}

export interface compareTypes<TNode extends Node = Node> {
  (context: BasicContext<TNode>, type1: MType, type2: MType): boolean;
}

export type EventResult = {
  errorMessage?: string;
} | void;

export interface onAddLink<
  TNode extends Node = Node,
  TLink extends Link = Link
> {
  (context: BasicContext<TNode, Type, TLink>, link: TLink): EventResult;
}

export interface onDeleteLink<
  TNode extends Node = Node,
  TLink extends Link = Link
> {
  (context: BasicContext<TNode, Type, TLink>, link: TLink): EventResult;
}

export interface onAddNode<TNode extends Node = Node> {
  (context: BasicContext<TNode>): EventResult;
}

export interface onDeleteNode<TNode extends Node = Node> {
  (context: BasicContext<TNode>): EventResult;
}
