import { Node, Type, Logger, nullLogger, Link, ROOT_SCOPE, Loader } from "./core";
import { TypeRepo, NodeRepo, LinkRepo } from "./repos";
import { Composer } from "./Composer";
import { GraphApi, TypesApi, NodesApi, LinksApi } from "./api";
import { InputProvider, NodeContext } from ".";

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
  private composer: Composer<MNode, MType, MLink>;
  private options: MedleyOptions<MNode, MType, MLink>

  public logger: Logger;
  public nodes: NodesApi<MNode, MType, MLink>;
  public types: TypesApi<MType>;
  public links: LinksApi<MLink>;
  public graph: GraphApi<MNode, MType, MLink>;
  public scopeId: string;

  public constructor(
    options?: MedleyOptions<MNode, MType, MLink>,
    public parentInstance?: Medley<MNode, MType, MLink>
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

    this.scopeId = this.options.scopeId || ROOT_SCOPE;
    this.logger = this.options.logger || nullLogger;

    this.types = new TypesApi<MType>(
      this.scopeId,
      this.options.typeRepo,
      parentInstance?.types
    );
    this.links = new LinksApi<MLink>(this.scopeId, this.options.linkRepo);
    this.nodes = new NodesApi<MNode, MType, MLink>(
      this.scopeId,
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

    this.composer = new Composer<MNode, MType, MLink>(this, this.options.cache);
  }

  public runNode<T>(
    context: {} | null,
    nodeId: string,
    ...args: any[]
  ): Promise<T> {
    return this.composer.runNodeFunction(context, nodeId, null, ...args);
  }

  public runNodeWithInputs<T, TNode extends Node = Node>(
      context: {} | null,
      nodeId: string,
      inputs: InputProvider<TNode, MNode, MType, MLink>,
      ...args: any[]
    ): Promise<T> {
    return this.composer.runNodeFunction(context, nodeId, inputs, ...args);
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
