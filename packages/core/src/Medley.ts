import { Links, Nodes, Types } from "./api";
import { Conductor } from "./Conductor";
import {
  Graph, Loader,
  MemoryLoader, NonNullableType, ROOT_SCOPE
} from "./core";
import { MedleySetup } from "./MedleySetup";
import { MedleyTypes } from "./MedleyTypes";
import { LinkRepository, NodeRepository, TypeRepository } from "./repositories";

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

  public constructor(setup?: MedleySetup<M>) {
    this.loader = setup?.loader || new MemoryLoader();
    this.nodeRepository =
      setup?.nodeRepository || new NodeRepository<M["node"]>();
    this.typeRepository =
      setup?.typeRepository || new TypeRepository<M["type"]>(this.loader);
    this.linkRepository =
      setup?.linkRepository || new LinkRepository<M["link"]>();
    this.cache = setup?.cache || new Map();
    this.conductor = setup?.conductor || new Conductor(this, this.cache);

    this.scopeId = setup?.scopeId || ROOT_SCOPE;

    this.links =
      setup?.links || new Links<M["link"]>(this.scopeId, this.linkRepository);
    this.types =
      setup?.types || new Types<M["type"]>(this.scopeId, this.typeRepository);
    this.nodes =
      setup?.nodes || new Nodes<M["node"]>(this.scopeId, this.nodeRepository);
    this.conductor = setup?.conductor || new Conductor(this, setup?.cache);
  }

  public setGraph<TGraph extends Graph<M> = Graph<M>>(graph: TGraph) {
    this.typeRepository.setAllTypes(graph.types);
    this.nodeRepository.setAllNodes(graph.nodes);
    this.linkRepository.setAllLinks(graph.links);
    this.graph = graph;
  }

  public getGraph<TGraph extends Graph<M> = Graph<M>>() {
    const types = this.typeRepository
      .getAllTypes()
      .filter((t) => t.volatile == null || t.volatile === false);
    const nodes = this.nodeRepository
      .getAllNodes()
      .filter((n) => n.volatile == null || n.volatile === false);
    const links = this.linkRepository
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
