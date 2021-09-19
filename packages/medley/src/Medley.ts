import { Node, Type, Logger, nullLogger, Link } from "./core";
import { TypeRepo, NodeRepo, LinkRepo } from "./repos";
import { FlowEngine } from "./FlowEngine";
import { GraphApi, TypesApi, NodesApi, LinksApi } from "./api";

export interface MedleyOptions<
TNode extends Node = Node,
TType extends Type = Type,
TLink extends Link = Link
> {
  typeRepo: TypeRepo;
  nodeRepo: NodeRepo;
  linkRepo: LinkRepo;
  cache?: Map<string, unknown>;
  logger?: Logger;
  parent?: string;
  onConstruct?: (this: Medley<TNode, TType, TLink>) => void;
}

export class Medley<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  private flowEngine: FlowEngine<TNode, TType, TLink>;
  public readonly logger: Logger;

  public nodes: NodesApi<TNode, TType, TLink>;
  public types: TypesApi<TType>;
  public links: LinksApi<TLink>;
  public graph: GraphApi<TNode, TType, TLink>;

  public constructor(private options: MedleyOptions<TNode, TType, TLink>) {
    this.logger = options.logger || nullLogger;
    this.flowEngine = new FlowEngine<TNode, TType, TLink>(this, options.cache);
    this.types = new TypesApi<TType>(options.typeRepo);
    this.nodes = new NodesApi<TNode, TType, TLink>(
      this.flowEngine,
      options.nodeRepo,
      options.typeRepo,
      options.linkRepo,
      options.parent
    );
    this.links = new LinksApi<TLink>(options.linkRepo, options.parent);
    this.graph = new GraphApi(
      options.nodeRepo,
      options.typeRepo,
      options.linkRepo
    );
    options.onConstruct?.call(this);
  }

  public newChild(options: Partial<MedleyOptions<TNode, TType, TLink>>) {
    const childOptions: Partial<MedleyOptions<TNode, TType, TLink>> = {...options};
    childOptions.typeRepo = childOptions.typeRepo || this.options.typeRepo.newChild();
    return new Medley<TNode, TType, TLink>({ ...this.options, ...options });
  }
}
