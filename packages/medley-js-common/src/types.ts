import {
  BaseContext,
  Graph,
  Link,
  Medley,
  MedleyTypes,
  Node,
  NodePart,
  Port,
  Type,
} from "@medley-js/core";

export type Location = "left" | "top" | "right" | "bottom";

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
  position?: Coordinates;
}

export type CNodeWithValue<T> = CNode & {
  value: T;
};

export interface CLink extends Link {
  position?: Coordinates;
}

export type CNodePart<TNode extends CNode = CNode> = NodePart<TNode, CNode>;

export interface CType extends Type {
  version: string;
  label?: string;
  category?: string[];
  icon?: URL;
  repository?: string;
  system?: string;
  esm?: string;
  nameSpace?: string;
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
  openNodeEdit?: (context: BaseContext<CMedleyTypes>, node: CNode) => void;
  doDialog?: <T>(
    dialog: React.VFC<{ close: (result?: T) => void }>
  ) => Promise<T | undefined>;
  displayMessage?: () => void;
  constructNode?: (
    context: BaseContext<CMedleyTypes>,
    type?: CType
  ) => Promise<CNodePart | undefined>;
  selectNode?: () => Promise<CNode>;
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
