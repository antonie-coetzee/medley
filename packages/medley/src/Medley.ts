import { Node, Type, Logger, nullLogger, Link, ROOT_SCOPE, Loader } from "./core";
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

  public readonly options: MedleyOptions<TNode, TType, TLink>
  public readonly logger: Logger;
  public readonly nodes: NodesApi<TNode, TType, TLink>;
  public readonly types: TypesApi<TType>;
  public readonly links: LinksApi<TLink>;
  public readonly graph: GraphApi<TNode, TType, TLink>;

  public constructor(
    options?: MedleyOptions<TNode, TType, TLink>,
    public readonly parentInstance?: Medley<TNode, TType, TLink>
  ) {
    if(options == null){
      this.options = {
        linkRepo: new LinkRepo(),
        typeRepo: new TypeRepo(new Loader()),
        nodeRepo: new NodeRepo(),
      }
    }else{
      this.options = options;
    }
    
    const scopeId = this.options.scopeId || ROOT_SCOPE;
    this.logger = this.options.logger || nullLogger;

    this.types = new TypesApi<TType>(
      scopeId,
      this.options.typeRepo,
      parentInstance?.types
    );
    this.links = new LinksApi<TLink>(scopeId, this.options.linkRepo);
    this.nodes = new NodesApi<TNode, TType, TLink>(
      scopeId,
      this.options.nodeRepo,
      this.types,
      this.links,
      parentInstance?.nodes
    );
    this.graph = new GraphApi(
      this.nodes,
      this.types,
      this.links
    );

    this.flowEngine = new FlowEngine<TNode, TType, TLink>(this, this.options.cache);
    
    this.options.onConstruct?.call(this);
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
