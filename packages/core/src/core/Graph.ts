import { Type, Link, Node } from ".";

export interface Graph<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  name: string;
  types: TType[];
  nodes: TNode[];
  links: TLink[];
}
