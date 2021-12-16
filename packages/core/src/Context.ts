import {
  Node,
  Port,
  NodePart,
  Unwrap
} from "./core";
import { Medley } from "./Medley";
import { MedleyTypes } from "./MedleyTypes";

type TypeOfPort<T> = T extends Port<infer X> ? X : never;

export type Input = <TypedPort extends Port>(
  port: TypedPort,
  ...args: TypeOfPort<TypedPort> extends (...args: any) => any
    ? Parameters<TypeOfPort<TypedPort>>
    : any[]
) => Promise<Unwrap<TypeOfPort<TypedPort>> | undefined>;

export class BaseContext<MT extends MedleyTypes> {
  constructor(public medley: Medley<MT>) {}
}

export class NodePartContext<
  TNodePart extends NodePart<MT["node"]> = NodePart<Node>,
  MT extends Required<MedleyTypes> = Required<MedleyTypes>
> implements BaseContext<MT> {
  constructor(
    public medley: Medley<MT>,
    public nodePart: TNodePart
  ) {}
}

export class NodeContext<
  TNode extends MT["node"] = Node,
  MT extends MedleyTypes = MedleyTypes
> implements BaseContext<MT> {
  constructor(
    public medley: Medley<MT>,
    public node: TNode
  ) {}
}

export class ExecutionContext<
  TNode extends MT["node"] = Node,
  MT extends MedleyTypes = MedleyTypes
> implements NodeContext<TNode, MT> {
  constructor(
    public medley: Medley<MT>,
    public node: TNode,
    public input: Input
  ) {}
}
