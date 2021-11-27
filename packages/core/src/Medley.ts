import {
  Node,
  Type,
  Logger,
  nullLogger,
  Link,
  ROOT_SCOPE,
  Loader,
} from "./core";
import { TypeRepository, NodeRepository, LinkRepository } from "./repositories";
import { Conductor } from "./Conductor";
import { Graphs, Types, Nodes, Links } from "./api";

export interface MedleyOptions<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  loader?: Loader;
  typeRepo?: TypeRepository;
  nodeRepo?: NodeRepository;
  linkRepo?: LinkRepository;
  nodes?: Nodes<MNode, MType, MLink>;
  types?: Types<MType>;
  links?: Links<MLink>;
  conductor?: Conductor<MNode, MType, MLink>;
  cache?: Map<string, unknown>;
  logger?: Logger;
  scopeId?: string;
  parent?: Medley<MNode, MType, MLink>;
}

export class Medley<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  public parent?: Medley<MNode, MType, MLink>;

  public loader: Loader;
  public nodeRepo: NodeRepository;
  public typeRepo: TypeRepository;
  public linkRepo: LinkRepository;
  public cache: Map<string, unknown>;
  public conductor: Conductor<MNode, MType, MLink>;

  public scopeId: string;
  public logger: Logger;

  public nodes: Nodes<MNode, MType, MLink>;
  public types: Types<MType>;
  public links: Links<MLink>;
  public graphs: Graphs<MNode, MType, MLink>;

  private context: { [index: symbol]: unknown } = {};

  public constructor(options?: MedleyOptions<MNode, MType, MLink>) {
    this.loader = options?.loader || new Loader();
    this.nodeRepo = options?.nodeRepo || new NodeRepository();
    this.typeRepo = options?.typeRepo || new TypeRepository(this.loader);
    this.linkRepo = options?.linkRepo || new LinkRepository();
    this.cache = options?.cache || new Map();
    this.conductor = options?.conductor || new Conductor(this, this.cache);

    this.scopeId = options?.scopeId || ROOT_SCOPE;
    this.logger = options?.logger || nullLogger;

    this.links =
      options?.links || new Links<MLink>(this.scopeId, this.linkRepo);
    this.types = options?.types || new Types(this.scopeId, this.typeRepo);
    this.nodes =
      options?.nodes ||
      new Nodes<MNode, MType, MLink>(this.scopeId, this.nodeRepo, this.links);
    this.graphs = new Graphs<MNode, MType, MLink>(
      this.nodes,
      this.types,
      this.links
    );

    this.conductor =
      options?.conductor ||
      new Conductor<MNode, MType, MLink>(this, options?.cache);
  }

  public createContext<T>(value: T) {
    const symbol = Symbol();
    this.context[symbol] = value;
    return symbol;
  }

  public useContext<T>(context: symbol) {
    let contextValue = this.context[context] as T;
    if (contextValue == null && this.parent) {
      contextValue = this.parent.useContext(context);
    }
    return contextValue;
  }
}
