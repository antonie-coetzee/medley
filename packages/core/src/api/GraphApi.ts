import { LinksApi, NodesApi, TypesApi } from ".";
import { Graph, Link, Type, Node } from "../core";

export class GraphApi<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> extends EventTarget {
  private graph?: Graph<MNode, MType, MLink>;

  constructor(
    private nodesApi: NodesApi<MNode, MType, MLink>,
    private typesApi: TypesApi<MType>,
    private linksApi: LinksApi<MLink>
  ) {
    super();
  }

  public setGraph(graph: Graph<MNode, MType, MLink>, baseUrl: URL) {
    this.typesApi.setTypes(graph.types, baseUrl);
    this.nodesApi.setNodes(graph.nodes);
    this.linksApi.setLinks(graph.links);
    this.graph = graph;
  }

  public getGraph() {
    const types = this.typesApi
      .getAllTypes()
      .filter((t) => t.volatile == null || t.volatile === false);
    const nodes = this.nodesApi
      .getAllNodes()
      .filter((n) => n.volatile == null || n.volatile === false);
    const links = this.linksApi
      .getAllLinks()
      .filter((l) => l.volatile == null || l.volatile === false);
    return {
      ...this.graph,
      types,
      nodes,
      links,
    };
  }
}
