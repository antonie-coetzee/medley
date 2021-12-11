import {
  Link,
  NodePart,
  Node,
  Port,
  Type,
  BaseContext,
  Graph,
  BaseTypes,
} from "@medley-js/core";

export type Location = "left" | "top" | "right" | "bottom";

export type Coordinates = [x: number, y: number];

export type RType = {
  typeSystem: string;
  type: unknown;
};

export interface CBaseTypes extends BaseTypes {
  node: CNode,
  type: CType,
  link: CLink
}

export interface CNode extends Node {
  name: string;
  position?: Coordinates;
};

export type CNodeWithValue<T> = CNode & {
  value: T;
};

export interface CLink extends Link {
  position?: Coordinates;
};

export type CNodePart<TNode extends CNode = CNode> = NodePart<TNode>;

export interface CType extends Type {
  label?: string;
  category?: string[];
  icon?: URL;
  repository?: string;
};

export type CPort = Port;

export interface CGraph extends Graph {
  repos?:TypeRepository[]
}

export type Host = {
  openNodeEdit?: (
    context: BaseContext<CBaseTypes>,
    node: CNode
  ) => void;
  doDialog?: <T>(
    dialog: React.VFC<{ close: (result?: T) => void }>
  ) => Promise<T | undefined>;
  displayMessage?: () => void;
  constructNode?: (
    context: BaseContext<CBaseTypes>,
    type?: CType
  ) => Promise<CNodePart | undefined>;
  selectNode?: () => Promise<CNode>;
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
