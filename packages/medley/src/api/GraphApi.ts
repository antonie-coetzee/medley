import { LinksApi, NodesApi, TypesApi } from ".";
import { Graph, Link, Type, Node } from "../core";

export class GraphApi<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  private graph?: Graph<TNode, TType, TLink>;

  constructor(
    private nodesApi: NodesApi,
    private typesApi: TypesApi,
    private linksApi: LinksApi,
  ) {}

  public setGraph(graph: Graph<TNode, TType, TLink>, baseUrl: URL) {
    this.typesApi.load(graph.types, baseUrl);
    this.nodesApi.load(graph.nodes);
    this.linksApi.load(graph.links);
    this.graph = graph;
  }

  public getGraph() {
    const types = this.typesApi
      .getAllTypes()
      .filter((t) => t.volatile == null || t.volatile === false) as TType[];
    const nodes = this.nodesApi.getAllNodes() as TNode[];
    const links = this.linksApi.getAllLinks() as TLink[];
    return {
      ...this.graph,
      types,
      nodes,
      links,
    };
  }
}
