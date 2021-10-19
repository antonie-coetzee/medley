import { Medley } from "./Medley";
import { Link, Node, Type, Port } from "./core";
import { Input, ExecutionContext, NodeContext } from "./Context";
import { NodeFunction, nodeFunctionExport } from "./NodeFunction";
import { CacheStrategy } from "./core/CacheStrategy";

export type InputProvider<
  TNode extends Node = Node,
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = {
  [index: string]: (
    context: NodeContext<TNode, MNode, MType, MLink>
  ) => Promise<any>;
};

export class Composer<
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
    inputProvider: InputProvider<TNode, MNode, MType, MLink> | null,
    ...args: any[]
  ): Promise<T> {
    // use closure to capture nodeEngine on initial invocation
    const composer = this;
    const getNodeFunction = async function (
      context: ExecutionContext<TNode, MNode, MType, MLink>
    ) {
      const nodeFuction = Composer.buildNodeFunction<
        TNode,
        MNode,
        MType,
        MLink
      >(context, composer, nodeId, inputProvider);
      return nodeFuction;
    };

    const nodeFunction = await getNodeFunction(
      context as ExecutionContext<TNode, MNode, MType, MLink>
    );
    return nodeFunction(...args);
  }

  private static async buildNodeFunction<
    TNode extends Node = Node,
    MNode extends Node = Node,
    MType extends Type = Type,
    MLink extends Link = Link
  >(
    context: ExecutionContext<TNode, MNode, MType, MLink> | void,
    composer: Composer<MNode, MType, MLink>,
    nodeId: string,
    inputProvider: InputProvider<TNode, MNode, MType, MLink> | null
  ) {
    const runNodeFunction = async function <T>(
      parentContext: ExecutionContext<TNode, MNode, MType, MLink> | undefined,
      nodeId: string,
      inputProvider: InputProvider<TNode, MNode, MType, MLink> | null,
      ...args: any[]
    ): Promise<T> {
      const nodeFunction = await Composer.buildNodeFunction<
        TNode,
        MNode,
        MType,
        MLink
      >(parentContext, composer, nodeId, inputProvider);
      return nodeFunction(...args);
    };

    const node = (composer.medley.nodes.getNode(nodeId) as unknown) as TNode;
    if (node == null) {
      throw new Error(`node with id: '${nodeId}', not found`);
    }
    const nodeFunction = await composer.medley.types.getExportFunction<
      NodeFunction<{}, TNode, MNode, MType, MLink>
    >(node.type, nodeFunctionExport);

    if (nodeFunction == null) {
      throw new Error(`node function for type: '${node.type}', not valid`);
    }
    const childContext = composer.createContext(context, composer.medley, node);

    const portInput = composer.buildPortInputFunction(
      node,
      childContext,
      inputProvider,
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
    inputProvider: InputProvider<TNode, MNode, MType, MLink> | null,
    runNodeFunction: <T>(
      context: ExecutionContext<TNode, MNode, MType, MLink>,
      nodeId: string,
      inputProvider: InputProvider<TNode, MNode, MType, MLink> | null,
      ...args: any[]
    ) => Promise<T>
  ) {
    const composer = this;
    const portInputFunction = async function <T>(
      port: Port,
      ...args: any[]
    ): Promise<T | T[] | undefined> {
      if (inputProvider) {
        const inputFunction = inputProvider[port.name];
        if (inputFunction == null && port.required) {
          throw new Error(`port: '${port.name}' requires input`);
        }
        return inputFunction == null ? null : inputFunction(context);
      }
      let links = composer.medley.links.getPortLinks(port.name, node.id);
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
        return composer.cacheRunner(link.source, args, () =>
          runNodeFunction<T>(executionContext, link.source, null, args)
        );
      } else {
        const results = await Promise.all(
          links.map((l) =>
            composer.cacheRunner(l.source, args, () =>
              runNodeFunction<T>(executionContext, l.source, null, args)
            )
          )
        );
        if (results) {
          return results.filter((e) => e !== undefined);
        }
      }
    };
    return portInputFunction;
  }

  private async cacheRunner<T>(
    nodeId: string,
    args: any[],
    func: () => Promise<T>
  ) {
    const cacheItem = this.checkCache(nodeId, args);
    if (cacheItem && cacheItem.result) {
      return cacheItem.result as T;
    }
    const result = func();
    if (cacheItem && cacheItem.addToCache && cacheItem.key) {
      this.resultCache.set(cacheItem.key, result);
    }
    return result;
  }

  private checkCache(sourceId: string, ...args: any[]) {
    const node = this.medley.nodes.getNode(sourceId);
    if (
      node == null ||
      node.cache == null ||
      node.cache === CacheStrategy.none
    ) {
      return null;
    }
    let key = "";
    switch (node.cache) {
      case CacheStrategy.scope:
        key = `${this.medley.scopeId}${node.id}${args && JSON.stringify(args)}`;
        break;
      case CacheStrategy.global:
        key = `${node.id}${args && JSON.stringify(args)}`;
        break;
      default:
        return null;
    }
    if (this.resultCache.has(key)) {
      return {
        addToCache: false,
        result: this.resultCache.get(key),
      };
    }
    return { addToCache: true, key };
  }
}
