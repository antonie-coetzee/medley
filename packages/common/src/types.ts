import {
  Link,
  NodePart,
  Node,
  Port,
  Type,
  BaseContext,
  TypeVersion,
  Graph,
} from "@medley-js/core";

export type Location = "left" | "top" | "right" | "bottom";

export type Coordinates = [x: number, y: number];

export type RType = {
  typeSystem: string;
  type: unknown;
};

export type CNode = Node & {
  name: string;
  position?: Coordinates;
};

export type CNodeWithValue<T> = CNode & {
  value: T;
};

export type CLink = Link & {
  position?: Coordinates;
};

export type CNodePart<TNode extends CNode = CNode> = NodePart<TNode>;

export type CType = Type & {
  label?: string;
  category?: string[];
  icon?: URL;
  repository?: string;
};

export type CPort = Port;

export type CGraph = Graph & {
  repos?:TypeRepository[]
}

export type Host = {
  openNodeEdit?: (
    context: BaseContext<CNode, CType, CLink>,
    node: CNode
  ) => void;
  doDialog?: <T>(
    dialog: React.VFC<{ close: (result?: T) => void }>
  ) => Promise<T | undefined>;
  displayMessage?: () => void;
  constructNode?: (
    context: BaseContext<CNode, CType, CLink>,
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
