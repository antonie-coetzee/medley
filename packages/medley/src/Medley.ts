import {
  Loader,
  Node,
  LoaderOptions,
  Type,
  Graph,
  Logger,
  nullLogger,
  MapFactory,
} from "./core";
import { TypeStore } from "./TypeStore";
import { NodeStore } from "./NodeStore";
import { FlowEngine } from "./FlowEngine";
import { LinkStore } from "./LinkStore";
import { ReturnedPromiseType } from "./Context";

export interface MedleyOptions {
  loader: LoaderOptions;
  logger?: Logger;
  mapFactory?: MapFactory;
}

export class Medley {
  private graph?: Graph;
  private nodeStore: NodeStore;
  private typeStore: TypeStore;
  private linkStore: LinkStore;
  private flowEngine: FlowEngine;
  private baseLogger: Logger;

  public constructor(private options: MedleyOptions) {
    this.baseLogger = options.logger || nullLogger;
    const loader = new Loader(options.loader);
    this.typeStore = new TypeStore(loader, options.mapFactory);
    this.nodeStore = new NodeStore(options.mapFactory);
    this.linkStore = new LinkStore(options.mapFactory);
    this.flowEngine = new FlowEngine(this);
  }

  public new = () => {
    return new Medley(this.options);
  };

  public updateOptions = (options: Partial<MedleyOptions>) => {
    this.options = this.mergeDeep(this.options, options);
  };

  public import = (graph: Graph, baseUrl: URL) => {
    this.typeStore.load(graph.types, baseUrl);
    this.nodeStore.load(graph.nodes);
    this.linkStore.load(graph.links);
    this.graph = graph;
  };

  public runNodeFunction = async <T extends (...args: any) => any>(
    nodeId: string,
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    this.checkGraph();
    return this.flowEngine.runNodeFunction(nodeId, ...args);
  };

  public getGraph = () => {
    return this.graph;
  };

  public updateGraph = (updator: <T extends Graph>(composition: T) => T) => {
    this.checkGraph();
    if (this.graph && updator) {
      this.graph = updator(this.graph);
    }
  };

  public getNode = (nodeId: string) => {
    this.checkGraph();
    return this.nodeStore.getNode(nodeId);
  };

  public upsertTypedNode = (typedNode: Partial<Node>) => {
    this.checkGraph();
    if (typedNode.type == null) {
      throw new Error("typedNode requires typeName to be defined");
    }
    const type = this.typeStore.getType(typedNode.type);
    return this.upsertNode(type, typedNode);
  };

  public upsertNode = (type: Type, node: Partial<Node>) => {
    this.checkGraph();
    const hasType = this.typeStore.hasType(type.name);
    if (hasType === false) {
      this.typeStore.addType(type);
    }
    const outNode = this.nodeStore.upsertNode({
      ...node,
      type: type.name,
    });
    return outNode;
  };

  public getNodesByType = (typeName: string) => {
    this.checkGraph();
    return this.nodeStore.getNodesByType(typeName);
  };

  public deleteNodeById = (nodeId: string) => {
    this.checkGraph();
    const typeName = this.nodeStore.getTypeNameFromNodeId(nodeId);
    if (typeName == null) {
      throw new Error(`type name for node with id: '${nodeId}', not found`);
    }
    const type = this.typeStore.getType(typeName);
    const deleted = this.nodeStore.deleteNode(nodeId);

    if (deleted) {
      const nodes = this.nodeStore.getNodesByType(typeName);
      // delete type if not referenced
      if (nodes?.length == null || nodes?.length === 0) {
        this.typeStore.deleteType(typeName);
      }
    }
  };

  public getType = (typeName: string) => {
    this.checkGraph();
    return this.typeStore.getType(typeName);
  };

  public getTypes = () => {
    this.checkGraph();
    return this.typeStore.getTypes();
  };

  public getNodeFunctionFromType = async (typeName: string) => {
    this.checkGraph();
    return this.typeStore.getNodeFunction(typeName);
  };

  public getExportFromType = async <T>(
    typeName: string,
    exportName: string
  ) => {
    this.checkGraph();
    return this.typeStore.getExport(typeName, exportName) as Promise<T>;
  };

  public deleteType = (typeName: string) => {
    this.checkGraph();
    this.nodeStore.deleteNodesByType(typeName);
    this.typeStore.deleteType(typeName);
  };

  public export = <T extends Graph = Graph>() => {
    this.checkGraph();
    const types = this.typeStore.getTypes();
    const links = this.linkStore.getLinks();
    const nodes = this.nodeStore.getNodes();
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
    this.linkStore.addLink(source, target, port, instance);
  }

  public getPortLinks(nodeId: string, portName: string) {
    return this.linkStore.getPortLinks(nodeId, portName);
  }

  public getPortsFromType(typeName: string) {
    return this.typeStore.getPortsFromType(typeName);
  }

  public getLogger = () => {
    return this.baseLogger;
  };

  private checkGraph() {
    if (this.graph == null) {
      throw new Error("graph not loaded");
    }
  }

  private mergeDeep(...objects: any[]) {
    if (objects == null) {
      return;
    }

    const isObject = (obj: any) => obj && typeof obj === "object";

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }
}
