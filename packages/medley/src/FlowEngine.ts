import { Medley } from "./Medley";
import { Link, Node, Type, Port } from "./core";
import { Input, ExecutionContext } from "./Context";
import { NodeFunction, nodeFunctionExportName } from "./NodeFunction";

export class FlowEngine<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  private resultCache: Map<string, unknown>;
  constructor(
    private medley: Medley<TNode, TType, TLink>,
    cache?: Map<string, unknown>
  ) {
    this.resultCache = cache || new Map();
  }

  public runNodeFunction = async <T>(
    context: {} | null,
    nodeId: string,
    ...args: any[]
  ): Promise<T> => {
    // use closure to capture nodeEngine on initial invocation
    const flowEngine = this;
    const getNodeFunction = async function (
      context: ExecutionContext<TNode, TType, TLink>
    ) {
      const nodeFuction = await FlowEngine.buildNodeFunction(
        context,
        flowEngine,
        nodeId
      );
      return nodeFuction;
    };

    const nodeFunction = await getNodeFunction(
      context as ExecutionContext<TNode, TType, TLink>
    );
    return nodeFunction(...args);
  };

  private static async buildNodeFunction<
    TNode extends Node = Node,
    TType extends Type = Type,
    TLink extends Link = Link
  >(
    context: ExecutionContext<TNode, TType, TLink> | void,
    flowEngine: FlowEngine<TNode, TType, TLink>,
    nodeId: string
  ) {
    const runNodeFunction = async function <T>(
      parentContext: ExecutionContext<TNode, TType, TLink> | undefined,
      nodeId: string,
      ...args: any[]
    ): Promise<T> {
      const nodeFunction = await FlowEngine.buildNodeFunction(
        parentContext,
        flowEngine,
        nodeId
      );
      return nodeFunction(...args);
    };

    const node = flowEngine.medley.nodes.getNode(nodeId);
    if(node == null){
      throw new Error(`node with id: '${nodeId}', not found`);
    }
    const nodeFunction = await flowEngine.medley.types.getExportFunction<
      NodeFunction<{}, TNode, TType, TLink>
    >(node.type, nodeFunctionExportName);

    if(nodeFunction == null){
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
      runNodeFunction
    );

    childContext.input = portInput as Input;

    return (...args: any[]) => nodeFunction(childContext, ...args);
  }

  private createContext(
    parentContext: ExecutionContext<TNode, TType, TLink> | void,
    medley: Medley<TNode, TType, TLink>,
    node: TNode
  ): ExecutionContext<TNode, TType, TLink> {
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

    return childContext as ExecutionContext<TNode, TType, TLink>;
  }

  private buildPortInputFunction(
    node: Node,
    context: ExecutionContext<TNode, TType, TLink>,
    runNodeFunction: <T>(
      context: ExecutionContext<TNode, TType, TLink>,
      nodeId: string,
      ...args: any[]
    ) => Promise<T>
  ) {
    const flowEngine = this;
    const portInputFunction = async function <T>(
      port: Port,
      ...args: any[]
    ): Promise<T | T[] | undefined> {
      let links = flowEngine.medley.links.getPortLinks(port.name, node.id);
      if (links == null || links.length === 0) {
        return;
      }
      const isSingle = port.multiArity == null || port.multiArity === false;
      if (isSingle && links.length !== 1) {
        throw new Error(`multiple links detected for port: '${port.name}'`);
      }

      const executionContext = port.context
        ? { ...context, ...port.context }
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
