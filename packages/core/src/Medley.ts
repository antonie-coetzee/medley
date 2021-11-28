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
  typeRepository?: TypeRepository;
  nodeRepository?: NodeRepository;
  linkRepository?: LinkRepository;
  nodes?: Nodes<MNode>;
  types?: Types<MType>;
  links?: Links<MLink>;
  conductor?: Conductor<MNode, MType, MLink>;
  graphs?: Graphs<MNode, MType, MLink>;
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
  public readonly loader: Loader;
  public readonly nodeRepository: NodeRepository;
  public readonly typeRepository: TypeRepository;
  public readonly linkRepository: LinkRepository;
  public readonly cache: Map<string, unknown>;
  public readonly conductor: Conductor<MNode, MType, MLink>;

  public readonly scopeId: string;
  public readonly logger: Logger;

  public readonly nodes: Nodes<MNode>;
  public readonly types: Types<MType>;
  public readonly links: Links<MLink>;
  public readonly graphs: Graphs<MNode, MType, MLink>;

  private context: { [index: symbol]: unknown } = {};

  public constructor(options?: MedleyOptions<MNode, MType, MLink>) {
    this.loader = options?.loader || new Loader();
    this.nodeRepository = options?.nodeRepository || new NodeRepository();
    this.typeRepository = options?.typeRepository || new TypeRepository(this.loader);
    this.linkRepository = options?.linkRepository || new LinkRepository();
    this.cache = options?.cache || new Map();
    this.conductor = options?.conductor || new Conductor(this, this.cache);

    this.scopeId = options?.scopeId || ROOT_SCOPE;
    this.logger = options?.logger || nullLogger;

    this.links =
      options?.links || new Links<MLink>(this.scopeId, this.linkRepository);
    this.types = options?.types || new Types(this.scopeId, this.typeRepository);
    this.nodes =
      options?.nodes || new Nodes<MNode>(this.scopeId, this.nodeRepository);
    this.graphs = options?.graphs || new Graphs<MNode, MType, MLink>(
      this.nodes,
      this.types,
      this.links,
      this.loader
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
    return contextValue;
  }
}
