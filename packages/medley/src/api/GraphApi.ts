import { Graph, Link, Type, Node } from "../core";
import { TypeRepo, NodeRepo, LinkRepo } from "../repos";

export class GraphApi<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  private graph?: Graph<TNode, TType, TLink>;

  constructor(
    private nodeRepo: NodeRepo,
    private typeRepo: TypeRepo,
    private linkRepo: LinkRepo,
    private parent?: string
  ) {}

  public setGraph(graph: Graph<TNode, TType, TLink>, baseUrl: URL) {
    this.typeRepo.load(graph.types, baseUrl);
    this.nodeRepo.load(graph.nodes);
    this.linkRepo.load(graph.links);
    this.graph = graph;
  };

  public getGraph() {
    const types = this.typeRepo.getTypes() as TType[];
    const nodes = this.nodeRepo.getNodes() as TNode[];
    const links = this.linkRepo.getLinks() as TLink[];
    return {
      ...this.graph,
      types,
      nodes,
      links,
    };
  }

  public exportNode(node: TNode): Graph<TNode, TType, TLink> {
    const graph = this.exportNodeRecursive(node);
    // dedupe types
    graph.types = graph.types.filter(
      (v, i, a) => a.findIndex((t) => t === v) === i
    );
    return graph;
  }

  private exportNodeRecursive(
    node: TNode
  ): Graph<TNode, TType, TLink> {
    const nodeType = this.typeRepo.getType(node.type);
    const types = [nodeType as TType];

    let links:TLink[];
    if(nodeType.composite)
    {
      links = this.linkRepo.getLinks(node.id) as TLink[]
    } else{
      links = [] as TLink[];
    }

    if(links == null || links.length === 0){
      return {
        nodes: [node],
        types: types,
        links: [] as TLink[],
      } as Graph<TNode, TType, TLink>;
    }

    const nodes = links
      .map((l) => this.nodeRepo.getNode(l.source) as TNode)
      .filter((v, i, a) => a.findIndex((t) => t === v) === i);

    const childGraphs = nodes.map((n) => {
      return this.exportNodeRecursive(n);
    });

    const graphs = [{ nodes: [node, ...nodes], types, links }, ...childGraphs];
    return graphs.reduce((prev, crnt) => {
      return {
        links: [...prev.links, ...crnt.links],
        nodes: [...prev.nodes, ...crnt.nodes],
        types: [...prev.types, ...crnt.types],
      };
    });
  }
}
