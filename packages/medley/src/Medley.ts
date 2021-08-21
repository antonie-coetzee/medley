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
import { NodeRepo } from "./NodeRepo";
import { FlowEngine } from "./FlowEngine";
import { LinkRepo } from "./LinkRepo";
import { NodesApi } from "./NodesApi";
import { TypesApi } from "./TypesApi";
import { GraphApi } from "./GraphApi";

export interface MedleyOptions {
  typeRepo: TypeRepo;
  nodeRepo: NodeRepo;
  linkRepo: LinkRepo;
  cache?: Map<string, unknown>;
  logger?: Logger;
  onConstruct?: (this: Medley) => void;
}

export class Medley {
  private flowEngine: FlowEngine;
  private cache: Map<string, unknown>;

  public readonly logger: Logger;
 
  public nodes: NodesApi;
  public types: TypesApi;
  public links: LinkRepo;
  public graph: GraphApi;
  
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
    this.graph = new GraphApi(
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

  public clearCache = () => {
    this.cache.clear();
  };
}
