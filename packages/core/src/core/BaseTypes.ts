import { Node } from "./Node";
import { Link } from "./Link";
import { Type } from "./Type";
import { Module } from "./Module";

export interface BaseTypes<
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