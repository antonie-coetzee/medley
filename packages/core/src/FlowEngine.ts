import { Medley } from "./Medley";
import { Link, Node, Type, Port } from "./core";
import { Input, ExecutionContext, NodeContext } from "./Context";
import { NodeFunction, nodeFunctionExportName } from "./NodeFunction";

export type ExternalInputs<
TNode extends Node = Node,
MNode extends Node = Node,
MType extends Type = Type,
MLink extends Link = Link
> = {
  [index: string]: (
    context: NodeContext<TNode, MNode, MType, MLink>
  ) => Promise<any>;
};

export class FlowEngine<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  private resultCache: Map<string, unknown>;
  constructor(
    private medley: Medley<MNode, MType, MLink>,
    cache?: Map<string, unknown>
  ) {
    this.resultCache = cache || new Map();
  }

  public async runNodeFunction<T, TNode extends Node = Node>(
    context: {} | null,
    nodeId: string,
    externalInputs: ExternalInputs<TNode, MNode, MType, MLink> | null,
    ...args: any[]
  ): Promise<T> {
    // use closure to capture nodeEngine on initial invocation
    const flowEngine = this;
    const getNodeFunction = async function (
      context: ExecutionContext<TNode, MNode, MType, MLink>
    ) {
      const nodeFuction = await FlowEngine.buildNodeFunction<TNode, MNode, MType, MLink>(
        context,
        flowEngine,
        nodeId,
        externalInputs
      );
      return nodeFuction;
    };

    const nodeFunction = await getNodeFunction(
      context as ExecutionContext<TNode, MNode, MType, MLink>
    );
    return nodeFunction(...args);
  };

  private static async buildNodeFunction<
    TNode extends Node = Node,
    MNode extends Node = Node,
    MType extends Type = Type,
    MLink extends Link = Link
  >(
    context: ExecutionContext<TNode, MNode, MType, MLink> | void,
    flowEngine: FlowEngine<MNode, MType, MLink>,
    nodeId: string,
    externalInputs: ExternalInputs<TNode, MNode, MType, MLink> | null
  ) {
    const runNodeFunction = async function <T>(
      parentContext: ExecutionContext<TNode, MNode, MType, MLink> | undefined,
      nodeId: string,
      externalInputs: ExternalInputs<TNode, MNode, MType, MLink> | null,
      ...args: any[]
    ): Promise<T> {
      const nodeFunction = await FlowEngine.buildNodeFunction<TNode, MNode, MType, MLink>(
        parentContext,
        flowEngine,
        nodeId,
        externalInputs
      );
      return nodeFunction(...args);
    };

    const node = flowEngine.medley.nodes.getNode(nodeId) as unknown as TNode;
    if (node == null) {
      throw new Error(`node with id: '${nodeId}', not found`);
    }
    const nodeFunction = await flowEngine.medley.types.getExportFunction<
      NodeFunction<{}, TNode, MNode, MType, MLink>
    >(node.type, nodeFunctionExportName);

    if (nodeFunction == null) {
      throw new Error(`node function for type: '${node.type}', not valid`);
    }
    const childContext = flowEngine.createContext(
      context,
      flowEngine.medley,
      node
    );

    const portInput = flowEngine.buildPortInputFunction(
      node,
      childContext,
      externalInputs,
      runNodeFunction
    );

    childContext.input = portInput as Input;

    return (...args: any[]) => nodeFunction(childContext, ...args);
  }

  private createContext<TNode extends Node = Node>(
    parentContext: ExecutionContext<TNode, MNode, MType, MLink> | void,
    medley: Medley<MNode, MType, MLink>,
    node: TNode
  ): ExecutionContext<TNode, MNode, MType, MLink> {
    const logger = medley.logger.child({
      typeName: node.type,
      nodeId: node.id,
    });

    const childContext = {
      ...parentContext,
      medley,
      node,
      logger,
    };

    return childContext as ExecutionContext<TNode, MNode, MType, MLink>;
  }

  private buildPortInputFunction<TNode extends Node = Node>(
    node: TNode,
    context: ExecutionContext<TNode, MNode, MType, MLink>,
    externalInputs: ExternalInputs<TNode, MNode, MType, MLink> | null,
    runNodeFunction: <T>(
      context: ExecutionContext<TNode, MNode, MType, MLink>,
      nodeId: string,
      ...args: any[]
    ) => Promise<T>
  ) {
    const flowEngine = this;
    const portInputFunction = async function <T>(
      port: Port,
      ...args: any[]
    ): Promise<T | T[] | undefined> {
      if(externalInputs){
        return externalInputs[port.name]?.(context);
      }
      let links = flowEngine.medley.links.getPortLinks(port.name, node.id);
      if (links == null || links.length === 0) {
        return;
      }
      const isSingle = port.multiArity == null || port.multiArity === false;
      if (isSingle && links.length !== 1) {
        throw new Error(`multiple links detected for port: '${port.name}'`);
      }

      const executionContext = port.context
        ? { ...port.context, ...context }
        : context;

      if (isSingle) {
        const link = links[0];
        const cacheItem = flowEngine.checkCache(node.id, args);
        if (cacheItem && cacheItem.result) {
          return cacheItem.result as T;
        }
        const result = runNodeFunction<T>(executionContext, link.source, args);
        if (cacheItem && cacheItem.addToCache && cacheItem.key) {
          flowEngine.addToCache(cacheItem.key, result);
        }
        return result;
      } else {
        const cacheItem = flowEngine.checkCache(node.id, args);
        if (cacheItem && cacheItem.result) {
          return cacheItem.result as T[];
        }
        const results = await Promise.all(
          links.map((l) => runNodeFunction<T>(executionContext, l.source, args))
        );
        if (results) {
          const validResults = results.filter((e) => e !== undefined);
          if (cacheItem && cacheItem.addToCache && cacheItem.key) {
            flowEngine.addToCache(cacheItem.key, validResults);
          }
          return validResults;
        }
      }
    };
    return portInputFunction;
  }

  private checkCache(sourceId: string, ...args: any[]) {
    const node = this.medley.nodes.getNode(sourceId);
    if (node == null || node.cache == null || node.cache === false) {
      return null;
    }
    const key = `${node.id}${JSON.stringify(args)}`;
    if (this.resultCache.has(key)) {
      return {
        addToCache: false,
        result: this.resultCache.get(key),
      };
    }
    return { addToCache: true, key };
  }

  private addToCache(key: string, result: any) {
    this.resultCache.set(key, result);
  }
}
