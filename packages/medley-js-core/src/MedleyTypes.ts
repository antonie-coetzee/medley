import { Link, Node, Type } from "./core";

export interface MedleyTypes<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link,
> {
  node?: MNode;
  type?: MType;
  link?: MLink;
}