import { Medley } from "./Medley";
import { Link, Node, Type, Port, Unwrap } from "./core";
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

  public async runNode<T = unknown>(
    nodeId: string,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>> {
    return this.runNodeWithInputs(nodeId, null, ...args);
  }

  public async runNodeWithInputs<T = unknown>(
    nodeId: string,
    inputProvider: InputProvider<MNode, MType, MLink> | null,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>> {
    const node = this.medley.nodes.getNode(nodeId);
    if (node == null) {
      throw new Error(`node with id: '${nodeId}', not found`);
    }
    const nodeFunction = await this.medley.types.getExportFunction<
      NodeFunction<MNode, MNode, MType, MLink>
    >(node.type, nodeFunctionExportName);

    if (nodeFunction == null) {
      throw new Error(`node function for type: '${node.type}', not valid`);
    }

    const context = {
      medley: this.medley,
      node,
      logger: this.medley.logger.child({
        typeName: node.type,
        nodeId: node.id,
      }),
    } as ExecutionContext<MNode, MNode, MType, MLink>;

    if (inputProvider == null) {
      context.input = this.portInput.bind({
        conductor: this,
        context,
      }) as Input;
    } else {
      context.input = this.inputProviderInput.bind({
        conductor: this,
        context,
        inputProvider,
      }) as Input;
    }

    return nodeFunction(context, args);
  }

  private async inputProviderInput<T, TNode extends Node = Node>(
    this: {
      context: ExecutionContext<TNode, MNode, MType, MLink>;
      conductor: Conductor<MNode, MType, MLink>;
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

  private async portInput(
    this: {
      context: ExecutionContext<MNode, MNode, MType, MLink>;
      conductor: Conductor<MNode, MType, MLink>;
    },
    port: Port,
    ...args: any[]
  ): Promise<unknown | undefined> {
    let links = this.conductor.medley.links.getPortLinks(
      port.name,
      this.context.node.id
    );
    if (links == null || (links.length === 0 && port.required == false)) {
      return;
    }
    if (links.length === 0 && port.required === true) {
      throw new Error(`required port not linked: '${port.name}'`);
    }
    if (links.length !== 1) {
      throw new Error(`multiple links detected for port: '${port.name}'`);
    }
    const link = links[0];

    return this.conductor.cacheRunner(link.source, args, async () => {
      return this.conductor.runNode(link.source, null, args);
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
