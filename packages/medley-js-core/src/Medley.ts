import { Links, Nodes, Types } from "./scoped";
import { Composer } from "./Composer";
import { DEFAULT_SCOPE, Loader, NonNullableType } from "./core";
import { Graph } from "./Graph";
import { MedleyOptions } from "./MedleyOptions";
import { MedleyTypes } from "./MedleyTypes";
import { LinkRepository, NodeRepository, TypeRepository } from "./repositories";

export class Medley<
  MT extends MedleyTypes = MedleyTypes,
  M extends NonNullableType<MT> = NonNullableType<MT>
> {
  public readonly loader: Loader<M["type"]>;
  public readonly nodeRepository: NodeRepository<M["node"]>;
  public readonly typeRepository: TypeRepository<M["type"]>;
  public readonly linkRepository: LinkRepository<M["link"]>;
  public readonly composer: Composer<MT>;

  public readonly scope: string;

  public readonly nodes: Nodes<M["node"]>;
  public readonly types: Types<M["type"]>;
  public readonly links: Links<M["link"]>;

  private graph?: Graph<M>;

  public constructor(options?: MedleyOptions<M>) {
    this.loader = options?.loader || { import: async () => undefined };

    this.nodeRepository =
      options?.nodeRepository || new NodeRepository<M["node"]>();
    this.typeRepository =
      options?.typeRepository || new TypeRepository<M["type"]>(this.loader);
    this.linkRepository =
      options?.linkRepository || new LinkRepository<M["link"]>();

    this.scope = options?.scope || DEFAULT_SCOPE;

    this.links =
      options?.links || new Links<M["link"]>(this.scope, this.linkRepository);
    this.types =
      options?.types || new Types<M["type"]>(this.scope, this.typeRepository);
    this.nodes =
      options?.nodes || new Nodes<M["node"]>(this.scope, this.nodeRepository);

    this.composer = options?.composer || new Composer<MT>(this);
  }

  public setGraph<TGraph extends Graph<M> = Graph<M>>(graph: TGraph) {
    this.typeRepository.setTypes(graph.types);
    this.nodeRepository.setNodes(graph.nodes);
    this.linkRepository.setLinks(graph.links);
    this.graph = graph;
  }

  public getGraph<TGraph extends Graph<M> = Graph<M>>() {
    const types = this.typeRepository
      .getTypes()
      .filter((t) => t.volatile == null || t.volatile === false);
    const nodes = this.nodeRepository
      .getNodes()
      .filter((n) => n.volatile == null || n.volatile === false);
    const links = this.linkRepository
      .getLinks()
      .filter((l) => l.volatile == null || l.volatile === false);
    return {
      ...this.graph,
      types,
      nodes,
      links,
    } as TGraph;
  }
}
