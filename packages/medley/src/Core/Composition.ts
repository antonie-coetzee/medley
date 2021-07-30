import { Node, Type, Link } from ".";

export interface Composition {
  links: Link[];
  parts: Part[];
}

export interface Part {
  type: Type;
  nodes: Node[];
}
