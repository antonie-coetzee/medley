import {
  Node,
  Type,
  Logger,
  nullLogger,
  Link,
  ROOT_SCOPE,
  Loader,
  MemoryLoader,
  BaseTypes,
  Graph,
} from "./core";
import { TypeRepository, NodeRepository, LinkRepository } from "./repositories";
import { Conductor } from "./Conductor";
import { Types, Nodes, Links } from "./api";

export interface MedleyOptions<BT extends BaseTypes = BaseTypes> {
  loader?: Loader<NonNullable<BT["module"]>>;
  typeRepository?: TypeRepository<NonNullable<BT["type"]>>;
  nodeRepository?: NodeRepository<NonNullable<BT["node"]>>;
  linkRepository?: LinkRepository<NonNullable<BT["link"]>>;
  nodes?: Nodes<NonNullable<BT["node"]>>;
  types?: Types<NonNullable<BT["type"]>>;
  links?: Links<NonNullable<BT["link"]>>;
  conductor?: Conductor<BT>;
  cache?: Map<string, unknown>;
  logger?: Logger;
  scopeId?: string;
}

export class Medley<BT extends BaseTypes = BaseTypes> {
  public readonly loader: Loader;
  public readonly nodeRepository: NodeRepository<NonNullable<BT["node"]>>;
  public readonly typeRepository: TypeRepository<NonNullable<BT["type"]>>;
  public readonly linkRepository: LinkRepository<NonNullable<BT["link"]>>;
  public readonly cache: Map<string, unknown>;
  public readonly conductor: Conductor<BT>;

  public readonly scopeId: string;
  public readonly logger: Logger;

  public readonly nodes: Nodes<NonNullable<BT["node"]>>;
  public readonly types: Types<NonNullable<BT["type"]>>;
  public readonly links: Links<NonNullable<BT["link"]>>;

  private graph?:  Graph<BT>;

  public constructor(options?: MedleyOptions<BT>) {
    this.loader = options?.loader || new MemoryLoader();
    this.nodeRepository = options?.nodeRepository || new NodeRepository();
    this.typeRepository =
      options?.typeRepository || new TypeRepository(this.loader);
    this.linkRepository =
      options?.linkRepository || new LinkRepository<NonNullable<BT["link"]>>();
    this.cache = options?.cache || new Map();
    this.conductor = options?.conductor || new Conductor(this, this.cache);

    this.scopeId = options?.scopeId || ROOT_SCOPE;
    this.logger = options?.logger || nullLogger;

    this.links =
      options?.links || new Links<NonNullable<BT["link"]>>(this.scopeId, this.linkRepository);
    this.types =
      options?.types || new Types<NonNullable<BT["type"]>>(this.scopeId, this.typeRepository);
    this.nodes =
      options?.nodes || new Nodes<NonNullable<BT["node"]>>(this.scopeId, this.nodeRepository);
    this.conductor =
      options?.conductor ||
      new Conductor<BT>(this, options?.cache);
  }

  public setGraph<
  TGraph extends Graph<BT> = Graph<BT>
>(graph: TGraph) {
  this.types.setTypes(graph.types);
  this.nodes.setNodes(graph.nodes);
  this.links.setLinks(graph.links);
  this.graph = graph;
}

public getGraph<
  TGraph extends Graph<BT> = Graph<BT>
>() {
  const types = this.types
    .getAllTypes()
    .filter((t) => t.volatile == null || t.volatile === false);
  const nodes = this.nodes
    .getAllNodes()
    .filter((n) => n.volatile == null || n.volatile === false);
  const links = this.links
    .getAllLinks()
    .filter((l) => l.volatile == null || l.volatile === false);
  return {
    ...this.graph,
    types,
    nodes,
    links,
  } as TGraph;
}
}
