import { Link, Module, Node, Type } from "./core";

export interface MedleyTypes<
  MModule extends Module = Module,
  MNode extends Node = Node,
  MType extends Type<MModule> = Type<MModule>,
  MLink extends Link = Link,
> {
  node?: MNode;
  type?: MType;
  link?: MLink;
  module?: MModule;
}