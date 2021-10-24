import { NodePart, Node } from "@medley-js/core";

export type CNodePart<T extends unknown = unknown> = NodePart<Node<T>> & {
  name: string;
  position?: {
    x:number,
    y:number
  }
};
