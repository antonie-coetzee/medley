import { Medley } from "./Medley";
import { Port, ROOT_SCOPE, Unwrap } from "./core";
import { Input, ExecutionContext } from "./Context";
import {
  NodeFunction,
  nodeFunction as nodeFunctionExportName,
} from "./NodeFunction";
import { BaseContext } from ".";
import { MedleyTypes } from "./MedleyTypes";

export type InputProvider<MT extends MedleyTypes = MedleyTypes> = {
  [index: string]: (context: BaseContext<MT>) => Promise<any>;
};

export class Conductor<MT extends MedleyTypes = MedleyTypes> {
  private resultCache: Map<string, unknown>;
  constructor(private medley: Medley<MT>, cache?: Map<string, unknown>) {
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
    inputProvider: InputProvider<MT> | null,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>> {
    const node = this.medley.nodes.getNode(nodeId);
    if (node == null) {
      throw new Error(`node with id: '${nodeId}', not found`);
    }
    const nodeFunction = await this.medley.types.getExport<
      NodeFunction<MT["node"], MT>
    >(node.type, nodeFunctionExportName);

    if (nodeFunction == null) {
      throw new Error(`node function for type: '${node.type}', not valid`);
    }

    const context = new ExecutionContext<MT["node"], MT>(
      this.medley,
      node,
      {} as Input
    );

    if (inputProvider == null) {
      context.input = this.portInput.bind({
        conductor: this,
        nodeId,
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

  private async inputProviderInput(
    this: {
      context: ExecutionContext<MT["node"], MT>;
      conductor: Conductor<MT>;
      inputProvider: InputProvider<MT>;
    },
    port: Port
  ): Promise<unknown | undefined> {
    const inputFunction = this.inputProvider[port.name];
    if (inputFunction == null && port.required) {
      throw new Error(`port: '${port.name}' requires input`);
    }
    return inputFunction == null ? null : inputFunction(this.context);
  }

  private async portInput(
    this: {
      nodeId: string;
      conductor: Conductor<MT>;
    },
    port: Port,
    ...args: any[]
  ): Promise<unknown | undefined> {
    let links = this.conductor.medley.links.getPortLinks(
      port.name,
      this.nodeId
    );
    if (links == null || (links.length === 0 && !port.required)) {
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
    if (cacheItem && cacheItem.hit) {
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
    if (node == null) {
      return null;
    }
    const key = `${node.scope || ROOT_SCOPE}${node.id}${
      args !== [] && JSON.stringify(args)
    }`;

    if (this.resultCache.has(key)) {
      return {
        addToCache: false,
        hit: true,
        result: this.resultCache.get(key),
      };
    }
    return { addToCache: true, hit: false, key };
  }
}
