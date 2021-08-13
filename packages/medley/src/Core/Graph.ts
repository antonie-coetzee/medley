import { Type, Link, Node } from ".";

export interface Graph {
  types: Type[];
  nodes: Node[];
  links: Link[];
}
