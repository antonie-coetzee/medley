import { Node, Type, Logger, nullLogger, Link, ROOT_SCOPE } from "./core";
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
  scopeId?: string;
  onConstruct?: (this: Medley<TNode, TType, TLink>) => void;
}

export class Medley<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  private flowEngine: FlowEngine<TNode, TType, TLink>;

  public readonly logger: Logger;
  public readonly nodes: NodesApi<TNode, TType, TLink>;
  public readonly types: TypesApi<TType>;
  public readonly links: LinksApi<TLink>;
  public readonly graph: GraphApi<TNode, TType, TLink>;

  public constructor(
    public readonly options: MedleyOptions<TNode, TType, TLink>,
    public readonly parentInstance?: Medley<TNode, TType, TLink>
  ) {
    const scopeId = options.scopeId || ROOT_SCOPE;
    this.logger = options.logger || nullLogger;

    this.types = new TypesApi<TType>(
      scopeId,
      options.typeRepo,
      parentInstance?.types
    );
    this.links = new LinksApi<TLink>(scopeId, options.linkRepo);
    this.nodes = new NodesApi<TNode, TType, TLink>(
      scopeId,
      options.nodeRepo,
      this.types,
      this.links,
      parentInstance?.nodes
    );
    this.graph = new GraphApi(
      this.nodes,
      this.types,
      this.links
    );

    this.flowEngine = new FlowEngine<TNode, TType, TLink>(this, options.cache);
    
    options.onConstruct?.call(this);
  }

  public runNode<T>(
    context: {} | null,
    nodeId: string,
    ...args: any[]
  ): Promise<T> {
    return this.flowEngine.runNodeFunction(context, nodeId, ...args);
  }

  public getRootInstance(): Medley<TNode, TType, TLink>{
    if(this.parentInstance){
      return this.parentInstance.getRootInstance();
    }else{
      return this;
    }
  }

  public static newChildInstance<
    TNode extends Node = Node,
    TType extends Type = Type,
    TLink extends Link = Link
  >(parent: Medley<TNode, TType, TLink>, scopeId: string) {
    if (scopeId == null || scopeId === "") {
      throw new Error("scopeId not valid");
    }
    const instance = new Medley<TNode, TType, TLink>(
      { ...parent.options, scopeId },
      parent
    );
    return instance;
  }
}
