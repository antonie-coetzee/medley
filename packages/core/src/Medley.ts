import { Node, Type, Logger, nullLogger, Link, ROOT_SCOPE, Loader } from "./core";
import { TypeRepo, NodeRepo, LinkRepo } from "./repos";
import { FlowEngine } from "./FlowEngine";
import { GraphApi, TypesApi, NodesApi, LinksApi } from "./api";
import { ExternalInputs, NodeContext } from ".";

export interface MedleyOptions<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
  > {
  typeRepo: TypeRepo;
  nodeRepo: NodeRepo;
  linkRepo: LinkRepo;
  cache?: Map<string, unknown>;
  logger?: Logger;
  scopeId?: string;
}

export class Medley<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
  > {
  private flowEngine: FlowEngine<MNode, MType, MLink>;

  public readonly options: MedleyOptions<MNode, MType, MLink>
  public readonly logger: Logger;
  public readonly nodes: NodesApi<MNode, MType, MLink>;
  public readonly types: TypesApi<MType>;
  public readonly links: LinksApi<MLink>;
  public readonly graph: GraphApi<MNode, MType, MLink>;

  public constructor(
    options?: MedleyOptions<MNode, MType, MLink>,
    public readonly parentInstance?: Medley<MNode, MType, MLink>
  ) {
    if (options == null) {
      this.options = {
        linkRepo: new LinkRepo(),
        typeRepo: new TypeRepo(new Loader()),
        nodeRepo: new NodeRepo(),
      }
    } else {
      this.options = options;
    }

    const scopeId = this.options.scopeId || ROOT_SCOPE;
    this.logger = this.options.logger || nullLogger;

    this.types = new TypesApi<MType>(
      scopeId,
      this.options.typeRepo,
      parentInstance?.types
    );
    this.links = new LinksApi<MLink>(scopeId, this.options.linkRepo);
    this.nodes = new NodesApi<MNode, MType, MLink>(
      scopeId,
      this.options.nodeRepo,
      this.types,
      this.links,
      parentInstance?.nodes
    );
    this.graph = new GraphApi<MNode, MType, MLink>(
      this.nodes,
      this.types,
      this.links
    );

    this.flowEngine = new FlowEngine<MNode, MType, MLink>(this, this.options.cache);
  }

  public runNode<T>(
    context: {} | null,
    nodeId: string,
    ...args: any[]
  ): Promise<T> {
    return this.flowEngine.runNodeFunction(context, nodeId, null, ...args);
  }

  public runNodeWithInputs<T, TNode extends Node = Node>(
      context: {} | null,
      nodeId: string,
      inputs: ExternalInputs<TNode, MNode, MType, MLink>,
      ...args: any[]
    ): Promise<T> {
    return this.flowEngine.runNodeFunction(context, nodeId, inputs, ...args);
  }

  public getRootInstance(): Medley<MNode, MType, MLink> {
    if (this.parentInstance) {
      return this.parentInstance.getRootInstance();
    } else {
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
