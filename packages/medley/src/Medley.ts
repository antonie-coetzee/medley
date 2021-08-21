import {
  Node,
  Type,
  Logger,
  nullLogger,
  Link,
} from "./core";
import { TypeRepo } from "./TypeRepo";
import { NodeRepo } from "./NodeRepo";
import { FlowEngine } from "./FlowEngine";
import { LinkRepo } from "./LinkRepo";
import { NodesApi } from "./NodesApi";
import { TypesApi } from "./TypesApi";
import { GraphApi } from "./GraphApi";
import { LinksApi } from "./LinksApi";

export interface MedleyOptions {
  typeRepo: TypeRepo;
  nodeRepo: NodeRepo;
  linkRepo: LinkRepo;
  cache?: Map<string, unknown>;
  logger?: Logger;
  onConstruct?: (this: Medley) => void;
}

export class Medley<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  private flowEngine: FlowEngine;
  private cache: Map<string, unknown>;

  public readonly logger: Logger;

  public nodes: NodesApi<TNode>;
  public types: TypesApi<TType>;
  public links: LinksApi<TLink>;
  public graph: GraphApi<TNode, TType, TLink>;

  public constructor(private options: MedleyOptions) {
    this.cache = this.options.cache || new Map();
    this.flowEngine = new FlowEngine(this, this.cache);
    this.logger = options.logger || nullLogger;
    this.types = new TypesApi<TType>(options.typeRepo);
    this.nodes = new NodesApi<TNode>(
      this.flowEngine,
      options.nodeRepo,
      options.typeRepo,
      options.linkRepo
    );
    this.links = new LinksApi<TLink>(options.linkRepo);
    this.graph = new GraphApi(
      options.nodeRepo,
      options.typeRepo,
      options.linkRepo
    );
    options.onConstruct?.call(this);
  }

  public newChild(options: Partial<MedleyOptions>) {
    return new Medley<TNode, TType, TLink>({ ...this.options, ...options });
  }

  public clearCache = () => {
    this.cache.clear();
  };
}
