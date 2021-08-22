import { Graph, Link, Type, Node } from "./core";
import { LinkRepo } from "./LinkRepo";
import { NodeRepo } from "./NodeRepo";
import { TypeRepo } from "./TypeRepo";

export class GraphApi<
TNode extends Node = Node,
TType extends Type = Type,
TLink extends Link = Link
> {
  private graph?: Graph;
  
  constructor(
    private nodeRepo: NodeRepo,
    private typeRepo: TypeRepo,
    private linkRepo: LinkRepo
  ) {}

  public setGraph = (graph: Graph, baseUrl: URL) => {
    this.typeRepo.load(graph.types, baseUrl);
    this.nodeRepo.load(graph.nodes);
    this.linkRepo.load(graph.links);
    this.graph = graph;
  };

  public getGraph = <T extends Graph = Graph>() => {
    const types = this.typeRepo.getTypes() as TType[];    
    const nodes = this.nodeRepo.getNodes() as TNode[];
    const links = this.linkRepo.getLinks() as TLink[];
    return {
      ...(this.graph as T),
      types,
      nodes,
      links,
    };
  };
}
