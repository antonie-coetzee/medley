import { Medley } from "./Medley";
import { Link, Node, Type, Port } from "./core";
import { Input, ExecutionContext, NodeContext } from "./Context";
import {
  NodeFunction,
  nodeFunction as nodeFunctionExportName,
} from "./NodeFunction";
import { Cache } from "./core/Cache";
import { BaseContext } from ".";

export type InputProvider<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> = {
  [index: string]: (context: BaseContext<MNode, MType, MLink>) => Promise<any>;
};

export class Conductor<
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
    nodeId: string,
    inputProvider: InputProvider<MNode, MType, MLink> | null,
    ...args: any[]
  ): Promise<T> {
    // use closure to capture nodeEngine on initial invocation
    const conductor = this;
    const getNodeFunction = async function () {
      const nodeFuction = Conductor.buildNodeFunction<
        TNode,
        MNode,
        MType,
        MLink
      >(conductor, nodeId, inputProvider);
      return nodeFuction;
    };

    const nodeFunction = await getNodeFunction();
    return nodeFunction(...args);
  }

  private static async buildNodeFunction<
    TNode extends Node = Node,
    MNode extends Node = Node,
    MType extends Type = Type,
    MLink extends Link = Link
  >(
    conductor: Conductor<MNode, MType, MLink>,
    nodeId: string,
    inputProvider: InputProvider<MNode, MType, MLink> | null
  ) {
    const node = (conductor.medley.nodes.getNode(nodeId) as unknown) as TNode;
    if (node == null) {
      throw new Error(`node with id: '${nodeId}', not found`);
    }
    const nodeFunction = await conductor.medley.types.getExportFunction<
      NodeFunction<TNode, MNode, MType, MLink>
    >(node.type, nodeFunctionExportName);

    if (nodeFunction == null) {
      throw new Error(`node function for type: '${node.type}', not valid`);
    }

    const context = {
      medley:conductor.medley,
      node,
      logger: conductor.medley.logger.child({
        typeName: node.type,
        nodeId: node.id,
      }),
    } as ExecutionContext<TNode, MNode, MType, MLink>;

    if (inputProvider == null) {
      context.input = conductor.portInput.bind({
        conductor,
        context,
      }) as Input;
    } else {
      context.input = conductor.inputProviderInput.bind({
        conductor,
        context,
        inputProvider,
      }) as Input;
    }

    return (...args: any[]) => nodeFunction(context, ...args);
  }

  async inputProviderInput<T, TNode extends Node = Node>(
    this: {
      context: ExecutionContext<TNode, MNode, MType, MLink>;
      conductor: Conductor;
      inputProvider: InputProvider<MNode, MType, MLink>;
    },
    port: Port,
    ...args: any[]
  ): Promise<T | undefined> {
    const inputFunction = this.inputProvider[port.name];
    if (inputFunction == null && port.required) {
      throw new Error(`port: '${port.name}' requires input`);
    }
    return inputFunction == null ? null : inputFunction(this.context);
  }

  async portInput<T, TNode extends Node = Node>(
    this: {
      context: ExecutionContext<TNode, MNode, MType, MLink>;
      conductor: Conductor;
    },
    port: Port,
    ...args: any[]
  ): Promise<T | undefined> {
    let links = this.conductor.medley.links.getPortLinks(
      port.name,
      this.context.node.id
    );
    if (links == null || (links.length === 0 && port.required == false)) {
      return;
    }
    if (links.length === 0 && port.required === true) {
      throw new Error(`link not detected for required port: '${port.name}'`);
    }
    if (links.length !== 1) {
      throw new Error(`multiple links detected for port: '${port.name}'`);
    }
    const link = links[0];
    return this.conductor.cacheRunner(link.source, args, async () => {
      const nodeFunction = await Conductor.buildNodeFunction<
        TNode,
        MNode,
        MType,
        MLink
      >(this.conductor, link.source, null);
      return nodeFunction(...args);
    });
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

  private checkCache(nodeId: string, ...args: any[]) {
    const node = this.medley.nodes.getNode(nodeId);
    if (node == null || node.cache == null || node.cache === Cache.none) {
      return null;
    }
    let key = "";
    switch (node.cache) {
      case Cache.scope:
        key = `${this.medley.scopeId}${node.id}${
          args !== [] && JSON.stringify(args)
        }`;
        break;
      case Cache.global:
        key = `${node.id}${args !== [] && JSON.stringify(args)}`;
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
