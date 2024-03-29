import {
  BaseContext,
  Graph,
  Link,
  Medley,
  MedleyTypes,
  NF,
  Node,
  NodeContext,
  NodePart,
  Port,
  Type,
} from "@medley-js/core";

export declare enum Position {
  Left = "left",
  Top = "top",
  Right = "right",
  Bottom = "bottom"
}

export declare enum ArrowHeadType {
  Arrow = "arrow",
  ArrowClosed = "arrowclosed"
}

export type Coordinates = [x: number, y: number];

export class RType {
  constructor(public system: string) {}
}

export type CMedley = Medley<CMedleyTypes>;

export interface CMedleyTypes extends MedleyTypes {
  node: CNode;
  type: CType;
  link: CLink;
}

export interface CNode extends Node {
  name: string;
  label?: string;
  note?: string;
  position?: Coordinates;
}

export type CNF<TNode extends CNode = CNode> = NF<TNode, CMedleyTypes>;

export type CNodeContext<TNode extends CNode = CNode> = NodeContext<
  TNode,
  CMedleyTypes
>;

export type CBaseContext = BaseContext<CMedleyTypes>;

export type CNodeWithValue<T> = CNode & {
  value: T;
};

export interface CLink extends Link {
  position?: Coordinates;
}

export type CNodeData<TNode extends CNode = CNode> = {
  [Property in keyof TNode as Exclude<Property, keyof CNode>]: TNode[Property];
};

export type CNodePart<TNode extends CNode = CNode> = NodePart<TNode>;

export interface CType extends Type {
  version: string;
  label?: string;
  description?: string;
  category?: string[];
  categoryIcon?: URL;
  icon?: URL;
  primitive?: boolean;
  repository?: string;
  system?: string;
  esm?: string;
  import?: () => Promise<{ [key: string]: unknown }>;
  exportMap?: {
    [key: string]: () => Promise<unknown>;
  };
}

export type CPort = Port;

export interface CGraph extends Graph {
  repos?: TypeRepository[];
}

export interface Command {
  execute: () => Promise<void>;
  undo?: () => Promise<void>;
}

export type Host = {
  displayPopover?: (component: React.VFC) => void;
  openWindow?: (component: React.VFC) => void;
  doDialog?: <T>(
    dialog: React.VFC<{ close: (result?: T) => void }>
  ) => Promise<T | undefined>;
  executeCommand: (command: Command) => Promise<void>;
};

export type TypeRepository = {
  id: string;
  origin: URL;
  name?: string;
  description?: string;
  collection?: TypeSummary[];
};

export type TypeSummary = {
  name: string;
  versions: {
    current: string;
    history?: string[];
  };
  description?: string;
};
