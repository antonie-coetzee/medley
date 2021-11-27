import {
  Node,
  Type,
  Logger,
  nullLogger,
  Link,
  ROOT_SCOPE,
  Loader,
  Unwrap,
  Chainable,
  Middleware,
  chainMiddleware,
} from "./core";
import { TypeRepo, NodeRepo, LinkRepo } from "./repos";
import { Conductor } from "./Conductor";
import { Graphs, Types, Nodes, Links } from "./api";
import { InputProvider } from ".";

export interface MedleyOptions<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  typeRepo: TypeRepo;
  nodeRepo: NodeRepo;
  linkRepo: LinkRepo;
  nodesApiMiddleware?: (
    use: (middleware: Middleware<Nodes<MNode, MType, MLink>>) => void
  ) => void;
  typesApiMiddleware?: (
    use: (middleware: Middleware<Types<MType>>) => void
  ) => void;
  linksApiMiddleware?: (
    use: (middleware: Middleware<Links<MLink>>) => void
  ) => void;
  cache?: Map<string, unknown>;
  logger?: Logger;
  scopeId?: string;
}

export class Medley<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  private conductor: Conductor<MNode, MType, MLink>;
  private options: MedleyOptions<MNode, MType, MLink>;

  public logger: Logger;
  public nodes: Nodes<MNode, MType, MLink>;
  public types: Types<MType>;
  public links: Links<MLink>;
  public graph: Graphs<MNode, MType, MLink>;
  public scopeId: string;
  private context: { [index: symbol]: unknown } = {};

  public constructor(
    options?: Partial<MedleyOptions<MNode, MType, MLink>>,
    public parentInstance?: Medley<MNode, MType, MLink>
  ) {
    if (options == null) {
      this.options = {
        linkRepo: new LinkRepo(),
        typeRepo: new TypeRepo(new Loader()),
        nodeRepo: new NodeRepo(),
      };
    } else {
      this.options = {
        ...options,
        linkRepo: options.linkRepo || new LinkRepo(),
        typeRepo: options.typeRepo || new TypeRepo(new Loader()),
        nodeRepo: options.nodeRepo || new NodeRepo(),
      };
    }

    this.scopeId = this.options.scopeId || ROOT_SCOPE;
    this.logger = this.options.logger || nullLogger;

    this.types = this.buildTypesApi(
      this.scopeId,
      this.options.typeRepo,
      parentInstance?.types,
      this.options.typesApiMiddleware
    );
    this.links = this.buildLinksApi(
      this.scopeId,
      this.options.linkRepo,
      this.parentInstance?.links,
      this.options.linksApiMiddleware
    );
    this.nodes = this.buildNodesApi(
      this.scopeId,
      this.options.nodeRepo,
      this.links,
      this.parentInstance?.nodes,
      this.options.nodesApiMiddleware
    );
    this.graph = new Graphs<MNode, MType, MLink>(
      this.nodes,
      this.types,
      this.links
    );

    this.conductor = new Conductor<MNode, MType, MLink>(
      this,
      this.options.cache
    );
  }

  public createContext<T>(value:T){
    const symbol = Symbol();
    this.context[symbol] = value;
    return symbol
  }

  public useContext<T>(context:symbol){
    let contextValue = this.context[context] as T;
    if(contextValue == null && this.parentInstance){
      contextValue = this.parentInstance.useContext(context);
    }
    return contextValue;
  }

  public runNode<T>(
    nodeId: string,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>> {
    return this.conductor.runNodeFunction(nodeId, null, ...args);
  }

  public runNodeWithInputs<T>(
    nodeId: string,
    inputs: InputProvider<MNode, MType, MLink>,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>> {
    return this.conductor.runNodeFunction(nodeId, inputs, ...args);
  }

  public getRootInstance(): Medley<MNode, MType, MLink> {
    if (this.parentInstance) {
      return this.parentInstance.getRootInstance();
    } else {
      return this;
    }
  }

  public static getScopedInstance<
    TNode extends Node = Node,
    TType extends Type = Type,
    TLink extends Link = Link
  >(
    parent: Medley<TNode, TType, TLink>,
    scopeId: string,
    isChild: boolean = false
  ) {
    if (scopeId == null || scopeId === "") {
      throw new Error("scopeId not valid");
    }
    const instance = new Medley<TNode, TType, TLink>(
      { ...parent.options, scopeId },
      isChild ? parent : undefined
    );
    return instance;
  }

  private buildNodesApi(
    scopeId: string,
    nodeRepo: NodeRepo,
    linksApi: Links<MLink>,
    parent?: Nodes<MNode, MType, MLink>,
    builder?: MedleyOptions<MNode, MType, MLink>["nodesApiMiddleware"]
  ) {
    let nodesApi = new Nodes<MNode, MType, MLink>(
      scopeId,
      nodeRepo,
      linksApi
    );
    if (parent) {
      nodesApi = chainMiddleware(parent, nodesApi);
    }
    if (builder) {
      const use = (middleware: Middleware<Nodes<MNode, MType, MLink>>) => {
        nodesApi = chainMiddleware(nodesApi, middleware);
      };
      builder(use);
    }
    return nodesApi;
  }

  private buildTypesApi(
    scopeId: string,
    typeRepo: TypeRepo,
    parent?: Types<MType>,
    builder?: MedleyOptions<MNode, MType, MLink>["typesApiMiddleware"]
  ) {
    let typesApi = new Types<MType>(scopeId, typeRepo);
    if (parent) {
      typesApi = chainMiddleware(parent, typesApi);
    }
    if (builder) {
      const use = (middleware: Middleware<Types<MType>>) => {
        typesApi = chainMiddleware(typesApi, middleware);
      };
      builder(use);
    }
    return typesApi;
  }

  private buildLinksApi(
    scopeId: string,
    linkRepo: LinkRepo,
    parent?: Links<MLink>,
    builder?: MedleyOptions<MNode, MType, MLink>["linksApiMiddleware"]
  ) {
    let linksApi = new Links<MLink>(scopeId, linkRepo);
    if (parent) {
      linksApi = chainMiddleware(parent, linksApi);
    }
    if (builder) {
      const use = (middleware: Middleware<Links<MLink>>) => {
        linksApi = chainMiddleware(linksApi, middleware);
      };
      builder(use);
    }
    return linksApi;
  }
}
