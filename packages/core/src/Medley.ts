import {
  ROOT_SCOPE,
  Loader,
  MemoryLoader,
  Graph,
  NonNullableType,
} from "./core";
import { TypeRepository, NodeRepository, LinkRepository } from "./repositories";
import { Conductor } from "./Conductor";
import { Types, Nodes, Links } from "./api";
import { MedleyTypes } from "./MedleyTypes";

export interface MedleyOptions<
  MT extends MedleyTypes = MedleyTypes,
  M extends NonNullableType<MT> = NonNullableType<MT>
> {
  loader?: Loader<M["module"]>;
  typeRepository?: TypeRepository<M["type"]>;
  nodeRepository?: NodeRepository<M["node"]>;
  linkRepository?: LinkRepository<M["link"]>;
  nodes?: Nodes<M["node"]>;
  types?: Types<M["type"]>;
  links?: Links<M["link"]>;
  conductor?: Conductor<M>;
  cache?: Map<string, unknown>;
  scopeId?: string;
}

export class Medley<
  MT extends MedleyTypes = MedleyTypes,
  M extends NonNullableType<MT> = NonNullableType<MT>
> {
  public readonly loader: Loader<M["module"]>;
  public readonly nodeRepository: NodeRepository<M["node"]>;
  public readonly typeRepository: TypeRepository<M["type"]>;
  public readonly linkRepository: LinkRepository<M["link"]>;
  public readonly cache: Map<string, unknown>;
  public readonly conductor: Conductor<MT>;

  public readonly scopeId: string;

  public readonly nodes: Nodes<M["node"]>;
  public readonly types: Types<M["type"]>;
  public readonly links: Links<M["link"]>;

  private graph?: Graph<M>;

  public constructor(options?: MedleyOptions<M>) {
    this.loader = options?.loader || new MemoryLoader();
    this.nodeRepository =
      options?.nodeRepository || new NodeRepository<M["node"]>();
    this.typeRepository =
      options?.typeRepository || new TypeRepository<M["type"]>(this.loader);
    this.linkRepository =
      options?.linkRepository || new LinkRepository<M["link"]>();
    this.cache = options?.cache || new Map();
    this.conductor = options?.conductor || new Conductor(this, this.cache);

    this.scopeId = options?.scopeId || ROOT_SCOPE;

    this.links =
      options?.links || new Links<M["link"]>(this.scopeId, this.linkRepository);
    this.types =
      options?.types || new Types<M["type"]>(this.scopeId, this.typeRepository);
    this.nodes =
      options?.nodes || new Nodes<M["node"]>(this.scopeId, this.nodeRepository);
    this.conductor =
      options?.conductor || new Conductor(this, options?.cache);
  }

  public setGraph<TGraph extends Graph<M> = Graph<M>>(graph: TGraph) {
    this.types.setTypes(graph.types);
    this.nodes.setNodes(graph.nodes);
    this.links.setLinks(graph.links);
    this.graph = graph;
  }

  public getGraph<TGraph extends Graph<M> = Graph<M>>() {
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
