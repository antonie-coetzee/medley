import { Node } from "medley";

export type CNode<T extends unknown = unknown> = Node<T> & {
  name: string;
  position?: {
    x:number,
    y:number
  }
};
