import { Composer } from "./Composer";
import { DEFAULT_SCOPE, Loader } from "./core";
import { Graph } from "./Graph";
import { MedleyOptions } from "./MedleyOptions";
import { MedleyTypes } from "./MedleyTypes";
import { LinkRepository, NodeRepository, TypeRepository } from "./repositories";
import { Links, Nodes, Types } from "./scoped";

export class Medley<MT extends MedleyTypes = MedleyTypes> {
  public readonly loader: Loader<NonNullable<MT["type"]>>;
  public readonly nodeRepository: NodeRepository<NonNullable<MT["node"]>>;
  public readonly typeRepository: TypeRepository<NonNullable<MT["type"]>>;
  public readonly linkRepository: LinkRepository<NonNullable<MT["link"]>>;
  public readonly composer: Composer<MT>;

  public readonly scope: string;

  public readonly nodes: Nodes<NonNullable<MT["node"]>>;
  public readonly types: Types<NonNullable<MT["type"]>>;
  public readonly links: Links<NonNullable<MT["link"]>>;

  private graph?: Graph<MT>;

  public constructor(options?: MedleyOptions<MT>) {
    this.loader = options?.loader || { import: async () => undefined };
    this.nodeRepository =
      options?.nodeRepository || new NodeRepository<NonNullable<MT["node"]>>();
    this.typeRepository =
      options?.typeRepository ||
      new TypeRepository<NonNullable<MT["type"]>>(this.loader);
    this.linkRepository =
      options?.linkRepository || new LinkRepository<NonNullable<MT["link"]>>();

    this.scope = options?.scope || DEFAULT_SCOPE;

    this.links =
      options?.links ||
      new Links<NonNullable<MT["link"]>>(this.scope, this.linkRepository);
    this.types =
      options?.types ||
      new Types<NonNullable<MT["type"]>>(this.scope, this.typeRepository);
    this.nodes =
      options?.nodes ||
      new Nodes<NonNullable<MT["node"]>>(this.scope, this.nodeRepository);

    this.composer = options?.composer || new Composer<MT>(this);
  }

  public async setGraph<TGraph extends Graph<MT> = Graph<MT>>(graph: TGraph) {
    await Promise.all([
      this.typeRepository.setTypes(graph.types),
      this.nodeRepository.setNodes(graph.nodes),
      this.linkRepository.setLinks(graph.links),
    ]);
    this.graph = graph;
  }

  public async getGraph<TGraph extends Graph<MT> = Graph<MT>>() {
    const types = (await this.typeRepository.getTypes()).filter(
      (t) => t.volatile == null || t.volatile === false
    );
    const nodes = (await this.nodeRepository.getNodes()).filter(
      (n) => n.volatile == null || n.volatile === false
    );
    const links = (await this.linkRepository.getLinks()).filter(
      (l) => l.volatile == null || l.volatile === false
    );
    return {
      ...this.graph,
      types,
      nodes,
      links,
    } as TGraph;
  }
}
