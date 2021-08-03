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
import { TypeStore } from "./TypeStore";
import { NodeStore } from "./NodeStore";
import { FlowEngine } from "./FlowEngine";
import { LinkStore } from "./LinkStore";
import { ReturnedPromiseType } from "./Context";

export interface MedleyOptions {
  loader: LoaderOptions;
  logger?: Logger;
  decorate?: {
    medley?: (medley: Medley) => void;
    typeStore?: (typeStore: TypeStore) => void;
    nodeStore?: (nodeStore: NodeStore) => void;
    linkStore?: (linkStore: LinkStore) => void;
  };
}

export class Medley {
  private graph?: Graph;
  private nodeStore: NodeStore;
  private typeStore: TypeStore;
  private linkStore: LinkStore;
  private flowEngine: FlowEngine;
  private baseLogger: Logger;

  public constructor(public options: MedleyOptions) {
    this.baseLogger = options.logger || nullLogger;
    const loader = new Loader(options.loader);
    this.typeStore = new TypeStore(loader, options.decorate?.typeStore);
    this.nodeStore = new NodeStore(options.decorate?.nodeStore);
    this.linkStore = new LinkStore(options.decorate?.linkStore);
    this.flowEngine = new FlowEngine(this);
    options.decorate?.medley?.call(null, this);
  }

  public import = (graph: Graph, baseUrl: URL) => {
    this.typeStore.load(graph.types, baseUrl);
    this.nodeStore.load(graph.nodes);
    this.linkStore.load(graph.links);
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
    return this.nodeStore.getNode(nodeId);
  };

  public upsertTypedNode = (node: Partial<Node>) => {
    this.checkGraph();
    if (node.type == null) {
      throw new Error("node requires typeName to be defined");
    }
    const type = this.typeStore.getType(node.type);
    return this.upsertNode(type, node);
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

  public copyNode = (node: Node, newName: string) => {
    const nodeCopy = JSON.parse(JSON.stringify(node)) as Partial<Node>;
    nodeCopy.name = newName;
    delete nodeCopy.id;
    this.upsertTypedNode(nodeCopy);
  };  

  public deleteNode = (nodeId: string) => {
    this.checkGraph();
    const typeName = this.nodeStore.getTypeNameFromNodeId(nodeId);
    if (typeName == null) {
      throw new Error(`type name for node with id: '${nodeId}', not found`);
    }

    const sourceLinks = this.linkStore.getSourceToLinks(nodeId);
    if(sourceLinks && sourceLinks.length > 0){
      throw new Error(`node with id: '${nodeId}' is linked and cannot be deleted`);
    }
    const deleted = this.nodeStore.deleteNode(nodeId);

    if (deleted) {
      const nodes = this.nodeStore.getNodesByType(typeName);
      // delete type if not referenced
      if (nodes && nodes.length === 0) {
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

  public deleteLink(link: Link) {
    return this.linkStore.deleteLink(link);
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
}
