import {
  Loader,
  Node,
  LoaderOptions,
  Type,
  Graph,
  Logger,
  nullLogger,
  Link,
} from "./core";
import { TypeRepo } from "./TypeRepo";
import { NodeRepo} from "./NodeRepo";
import { FlowEngine } from "./FlowEngine";
import { LinkRepo } from "./LinkRepo";
import { NodesApi } from "./NodesApi";
import { TypesApi } from "./TypesApi";

export interface MedleyOptions {
  typeRepo: TypeRepo;
  nodeRepo: NodeRepo;
  linkRepo: LinkRepo;
  cache?: Map<string, unknown>;
  logger?: Logger;
  onConstruct?: (this: Medley) => void;
}

export class Medley {
  private cache: Map<string, unknown>;
  private graph?: Graph;
  public nodes: NodesApi;
  public types: TypesApi;
  public links: LinkRepo;
  private flowEngine: FlowEngine;
  private logger: Logger;

  public constructor(private options: MedleyOptions) {
    this.cache = this.options.cache || new Map();
    this.flowEngine = new FlowEngine(this, this.cache);
    this.logger = options.logger || nullLogger;
    this.types = new TypesApi(options.typeRepo);
    this.nodes = new NodesApi(
      this.flowEngine,
      options.nodeRepo,
      options.typeRepo,
      options.linkRepo
    );
    this.links = options.linkRepo;

    options.onConstruct?.call(this);
  }

  public newChild(options: Partial<MedleyOptions>) {
    return new Medley({ ...this.options, ...options });
  }

  public setGraph = (graph: Graph, baseUrl: URL) => {
    this.options.typeRepo.load(graph.types, baseUrl);
    this.options.nodeRepo.load(graph.nodes);
    this.options.linkRepo.load(graph.links);
    this.graph = graph;
  };

  public getGraph = <T extends Graph = Graph>() => {
    this.checkGraph();
    const types = this.options.typeRepo.getTypes();
    const links = this.options.linkRepo.getLinks();
    const nodes = this.options.nodeRepo.getNodes();
    return {
      ...(this.graph as T),
      types,
      nodes,
      links,
    };
  };

  public clearCache = () => {
    this.cache.clear();
  };

  public getLogger = () => {
    return this.logger;
  };

  private checkGraph = () => {
    if (this.graph == null) {
      throw new Error("graph not loaded");
    }
  };
}
