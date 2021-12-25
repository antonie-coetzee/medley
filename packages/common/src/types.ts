import {
  BaseContext,
  Graph,
  Link,
  Medley,
  MedleyTypes,
  Module,
  Node,
  NodePart,
  Port,
  Type,
} from "@medley-js/core";

export type Location = "left" | "top" | "right" | "bottom";

export type Coordinates = [x: number, y: number];

export type RType = {
  typeSystem: string;
  type: unknown;
};

export interface CModule extends Module {
  system?: string;
  esm?: string;
  nameSpace?: string;
}

export type CMedley = Medley<CMedleyTypes>;

export interface CMedleyTypes extends MedleyTypes {
  node: CNode;
  type: CType;
  link: CLink;
  module: CModule;
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

export type CNodePart<TNode extends CNode = CNode> = NodePart<TNode>;

export interface CType extends Type<CModule> {
  label?: string;
  category?: string[];
  icon?: URL;
  repository?: string;
}

export type CPort = Port;

export interface CGraph extends Graph {
  repos?: TypeRepository[];
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
