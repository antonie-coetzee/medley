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
import { ReturnedPromiseType } from "./Context";
export interface MedleyOptions {
  typeRepo: TypeRepo;
  nodeRepo: NodeRepo;
  linkRepo: LinkRepo;
  cache?: Map<string, unknown>;
  logger?: Logger;
  onConstruct?: (this:Medley) => void;
}

export class Medley {
  private cache: Map<string, unknown>;
  private graph?: Graph;
  private nodeRepo: NodeRepo;
  private typeRepo: TypeRepo;
  private linkRepo: LinkRepo;
  private flowEngine: FlowEngine;
  private logger: Logger;

  public constructor(private options: MedleyOptions) {
    this.cache = this.options.cache || new Map();
    this.logger = options.logger || nullLogger;
    this.typeRepo = options.typeRepo;
    this.nodeRepo = options.nodeRepo;
    this.linkRepo = options.linkRepo;
    this.flowEngine = new FlowEngine(this, this.cache);
    options.onConstruct?.call(this);
  }

  public newChild(options: Partial<MedleyOptions>) {
    return new Medley({ ...this.options, ...options });
  }

  public import = (graph: Graph, baseUrl: URL) => {
    this.typeRepo.load(graph.types, baseUrl);
    this.nodeRepo.load(graph.nodes);
    this.linkRepo.load(graph.links);
    this.graph = graph;
  };

  public runNodeFunction = async <T extends (...args: any) => any>(
    context: {} | null,
    nodeId: string,
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    this.checkGraph();
    return this.flowEngine.runNodeFunction(context, nodeId, ...args);
  };

  public clearCache = () => {
    this.cache.clear();
  }

  public getGraph = () => {
    return this.graph;
  };

  public updateGraph = (updator: <T extends Graph>(graph: T) => T) => {
    this.checkGraph();
    if (this.graph && updator) {
      this.graph = updator(this.graph);
    }
  };

  public getNode = (nodeId: string) => {
    this.checkGraph();
    return this.nodeRepo.getNode(nodeId);
  };

  public upsertTypedNode = (node: Partial<Node>) => {
    this.checkGraph();
    if (node.type == null) {
      throw new Error("node requires typeName to be defined");
    }
    const type = this.typeRepo.getType(node.type);
    return this.upsertNode(type, node);
  };

  public upsertNode = (type: Type, node: Partial<Node>) => {
    this.checkGraph();
    const hasType = this.typeRepo.hasType(type.name);
    if (hasType === false) {
      this.typeRepo.addType(type);
    }
    const outNode = this.nodeRepo.upsertNode({
      ...node,
      type: type.name,
    });
    return outNode;
  };

  public getNodesByType = (typeName: string) => {
    this.checkGraph();
    return this.nodeRepo.getNodesByType(typeName);
  };

  public copyNode = (node: Node, newName: string) => {
    const nodeCopy = JSON.parse(JSON.stringify(node)) as Partial<Node>;
    nodeCopy.name = newName;
    delete nodeCopy.id;
    this.upsertTypedNode(nodeCopy);
  };

  public deleteNode = (nodeId: string) => {
    this.checkGraph();
    const typeName = this.nodeRepo.getTypeNameFromNodeId(nodeId);
    if (typeName == null) {
      throw new Error(`type name for node with id: '${nodeId}', not found`);
    }

    const sourceLinks = this.linkRepo.getSourceToLinks(nodeId);
    if (sourceLinks && sourceLinks.length > 0) {
      throw new Error(
        `node with id: '${nodeId}' is linked and cannot be deleted`
      );
    }
    const deleted = this.nodeRepo.deleteNode(nodeId);

    if (deleted) {
      const nodes = this.nodeRepo.getNodesByType(typeName);
      // delete type if not referenced
      if (nodes && nodes.length === 0) {
        this.typeRepo.deleteType(typeName);
      }
    }
  };

  public getType = (typeName: string) => {
    this.checkGraph();
    return this.typeRepo.getType(typeName);
  };

  public getTypes = () => {
    this.checkGraph();
    return this.typeRepo.getTypes();
  };

  public getNodeFunctionFromType = async (typeName: string) => {
    this.checkGraph();
    return this.typeRepo.getNodeFunction(typeName);
  };

  public getExportFromType = async <T>(
    typeName: string,
    exportName: string
  ) => {
    this.checkGraph();
    return this.typeRepo.getExport(typeName, exportName) as Promise<T>;
  };

  public export = <T extends Graph = Graph>() => {
    this.checkGraph();
    const types = this.typeRepo.getTypes();
    const links = this.linkRepo.getLinks();
    const nodes = this.nodeRepo.getNodes();
    return {
      ...(this.graph as T),
      types,
      nodes,
      links,
    };
  };

  public addLink(
    source: string,
    target: string,
    port: string,
    instance?: string
  ) {
    this.linkRepo.addLink(source, target, port, instance);
  }

  public getPortLinks = (nodeId: string, portName: string) => {
    return this.linkRepo.getPortLinks(nodeId, portName);
  }

  public deleteLink = (link: Link) => {
    return this.linkRepo.deleteLink(link);
  }

  public getPortsFromType = (typeName: string) => {
    return this.typeRepo.getPortsFromType(typeName);
  }

  public getLogger = () => {
    return this.logger;
  };

  private checkGraph = () => {
    if (this.graph == null) {
      throw new Error("graph not loaded");
    }
  }
}
