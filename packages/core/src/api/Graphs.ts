import { Links, Nodes, Types } from ".";
import { Graph, Link, Type, Node, Loader } from "../core";

export class Graphs<
  MNode extends Node,
  MType extends Type,
  MLink extends Link
> {
  private graph?: Graph<MNode, MType, MLink>;

  constructor(
    private nodes: Nodes<MNode>,
    private types: Types<MType>,
    private links: Links<MLink>,
    private loader: Loader
  ) {}

  public setGraph<
    TGraph extends Graph<MNode, MType, MLink> = Graph<MNode, MType, MLink>
  >(graph: TGraph, baseUrl: URL) {
    this.loader.baseUrl = baseUrl;
    this.types.setTypes(graph.types);
    this.nodes.setNodes(graph.nodes);
    this.links.setLinks(graph.links);
    this.graph = graph;
  }

  public getGraph<
    TGraph extends Graph<MNode, MType, MLink> = Graph<MNode, MType, MLink>
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
