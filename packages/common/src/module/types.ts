import { Link, NodePart, Node, Port, Type, BaseContext } from "@medley-js/core";
import { useContext } from "react";

export type Location = "left" | "top" | "right" | "bottom";

export type Coordinates = [x: number, y: number];

export type CNode<T extends unknown = unknown> = Node<T> & {
  name: string;
  position?: Coordinates;
};

export type CLink = Link & {
  position?: Coordinates;
};

export type CNodePart<T extends unknown = unknown> = NodePart<CNode<T>>;

export type CType = Type;

export type CPort = Port;

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
