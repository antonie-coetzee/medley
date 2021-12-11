import {
  Logger,
  Node,
  Port,
  NodePart,
  Unwrap,
  BaseTypes,
} from "./core";
import { Medley } from "./Medley";

type TypeOfPort<T> = T extends Port<infer X> ? X : never;

export type Input = <TypedPort extends Port>(
  port: TypedPort,
  ...args: TypeOfPort<TypedPort> extends (...args: any) => any
    ? Parameters<TypeOfPort<TypedPort>>
    : any[]
) => Promise<Unwrap<TypeOfPort<TypedPort>> | undefined>;

export class BaseContext<BT extends BaseTypes> {
  constructor(public medley: Medley<BT>, public logger: Logger) {}
}

export class NodePartContext<
  TNodePart extends NodePart<BT["node"]> = NodePart<Node>,
  BT extends Required<BaseTypes> = Required<BaseTypes>
> implements BaseContext<BT> {
  constructor(
    public medley: Medley<BT>,
    public logger: Logger,
    public nodePart: TNodePart
  ) {}
}

export class NodeContext<
  TNode extends BT["node"] = Node,
  BT extends BaseTypes = BaseTypes
> implements BaseContext<BT> {
  constructor(
    public medley: Medley<BT>,
    public logger: Logger,
    public node: TNode
  ) {}
}

export class ExecutionContext<
  TNode extends BT["node"] = Node,
  BT extends BaseTypes = BaseTypes
> implements NodeContext<TNode, BT> {
  constructor(
    public medley: Medley<BT>,
    public logger: Logger,
    public node: TNode,
    public input: Input
  ) {}
}
