import { Node, NodePart, Port, Unwrap } from "./core";
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
  TNodePart extends NodePart<NonNullable<MT["node"]>>,
  MT extends MedleyTypes = MedleyTypes
> extends BaseContext<MT> {
  constructor(medley: Medley<MT>, public nodePart: TNodePart) {
    super(medley);
  }
}

export class NodeContext<
  TNode extends MT["node"] = Node,
  MT extends MedleyTypes = MedleyTypes
> extends BaseContext<MT> {
  constructor(medley: Medley<MT>, public node: TNode) {
    super(medley);
  }
}

export class ExecutionContext<
  TNode extends MT["node"] = Node,
  MT extends MedleyTypes = MedleyTypes
> extends NodeContext<TNode, MT> {
  constructor(medley: Medley<MT>, node: TNode, public input: Input) {
    super(medley, node);
  }
}
