import { Medley } from "./Medley";
import { Node } from "./core";
import {
  Context,
  PortDefinition,
  PortInput,
  PortInputMultiple,
  ReturnedPromiseType,
} from "./Context";

export class FlowEngine {
  private resultCache: Map<string, unknown>;
  constructor(private medley: Medley, cache?: Map<string, unknown>) {
    this.resultCache = cache || new Map();
  }

  public runNodeFunction = async <T extends (...args: any) => any>(
    context: {} | null,
    nodeId: string,
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    // use closure to capture nodeEngine on initial invocation
    const flowEngine = this;
    const getNodeFunction = async function (this: Context | void) {
      const nodeFuction = await FlowEngine.buildNodeFunction(
        this,
        flowEngine,
        nodeId
      );
      return nodeFuction;
    };

    const nodeFunction = await getNodeFunction.call(context as Context);
    return nodeFunction(args);
  };

  private static async buildNodeFunction(
    context: Context | void,
    flowEngine: FlowEngine,
    nodeId: string
  ) {
    const runNodeFunction = async function <T extends (...args: any) => any>(
      this: Context | undefined,
      nodeId: string,
      ...args: Parameters<T>
    ): Promise<ReturnedPromiseType<T>> {
      const nodeFuction = await FlowEngine.buildNodeFunction(
        this,
        flowEngine,
        nodeId
      );
      return nodeFuction(args);
    };

    const node = flowEngine.medley.getNode(nodeId);
    const portInput = flowEngine.buildPortInputSingleFunction(
      flowEngine.medley,
      node,
      runNodeFunction
    );

    const portInputMultiple = flowEngine.buildPortInputMultipleFunction(
      flowEngine.medley,
      node,
      runNodeFunction
    );
    const newContex = flowEngine.createContext(
      context,
      flowEngine.medley,
      node,
      portInput,
      portInputMultiple
    );
    const nodeFunction = await flowEngine.medley.getNodeFunctionFromType(
      node.type
    );
    return nodeFunction.bind(newContex);
  }

  private createContext(
    parentContext: Context | void,
    medley: Medley,
    node: Node,
    portInputSingle: PortInput,
    portInputMultiple: PortInputMultiple
  ): Context {
    const logger = medley.getLogger().child({
      typeName: node.type,
      nodeId: node.id,
    });

    const instances = new Proxy(
      {},
      {
        get: (target: {}, property: string) => {
          if (typeof property === "symbol") {
            return;
          }
          return medley.getPortLinks(node.id, property)?.reduce((acc, l) => {
            if (l.instance) {
              acc.push(l.instance);
            }
            return acc;
          }, [] as string[]);
        },
      }
    );

    const context = {
      ...parentContext,
      medley,
      node,
      logger,
      port: {
        single: portInputSingle,
        multiple: portInputMultiple,
        instances,
      },
    };

    context.port.single = context.port.single.bind(context);
    context.port.multiple = context.port.multiple.bind(context);
    return context;
  }

  private buildPortInputSingleFunction(
    medley: Medley,
    node: Node,
    runNodeFunction: <T extends (...args: any) => any>(
      nodeId: string,
      ...args: Parameters<T>
    ) => Promise<ReturnedPromiseType<T>>
  ) {
    const flowEngine = this;
    const portInputSingleFunction = async function <
      T extends (...args: any) => any
    >(
      this: Context | undefined,
      portDefinition: PortDefinition<T>,
      ...args: Parameters<T>
    ): Promise<ReturnedPromiseType<T> | undefined> {
      let links = medley.getPortLinks(node.id, portDefinition.name);
      if (links == null || links.length === 0) {
        return;
      }
      if (portDefinition.instance) {
        links = links.filter((l) => l.instance === portDefinition.instance);
      }
      if (links.length === 0) {
        return;
      }
      if (links.length !== 1) {
        throw new Error(
          `multiple links detected for port: '${portDefinition.name}'`
        );
      }
      const link = links[0];
      const cacheHit = flowEngine.checkCache(link.source, args);
      if (cacheHit?.result) {
        return cacheHit.result as any;
      }
      const result = runNodeFunction.call(
        this,
        link.source,
        ...args
      ) as Promise<ReturnedPromiseType<T>>;
      if (cacheHit?.addToCache && cacheHit?.key) {
        flowEngine.addToCache(cacheHit.key, result);
      }
      return result;
    };
    return portInputSingleFunction;
  }

  private buildPortInputMultipleFunction(
    medley: Medley,
    node: Node,
    runNodeFunction: <T extends (...args: any) => any>(
      nodeId: string,
      ...args: Parameters<T>
    ) => Promise<ReturnedPromiseType<T>>
  ) {
    const flowEngine = this;
    const portInputMultipleFunction = async function <
      T extends (...args: any) => any
    >(
      this: Context | undefined,
      portDefinition: PortDefinition<T>,
      ...args: Parameters<T>
    ): Promise<ReturnedPromiseType<T>[] | undefined> {
      let links = medley.getPortLinks(node.id, portDefinition.name);
      if (links == null || links.length === 0) {
        return;
      }
      if (portDefinition.instance) {
        links = links.filter((l) => l.instance === portDefinition.instance);
      }
      if (links.length === 0) {
        return;
      }
      const results = await Promise.all(
        links.map((l) => {
          const cacheHit = flowEngine.checkCache(l.source, args);
          if (cacheHit?.result) {
            return cacheHit.result as any;
          }
          const result = runNodeFunction.call(
            this,
            l.source,
            ...args
          ) as Promise<ReturnedPromiseType<T>>;
          if (cacheHit?.addToCache && cacheHit?.key) {
            flowEngine.addToCache(cacheHit.key, result);
          }
        })
      );
      if (results) {
        return results.filter((e) => e !== undefined);
      }
    };
    return portInputMultipleFunction;
  }

  private checkCache(sourceId: string, ...args: any[]) {
    const node = this.medley.getNode(sourceId);
    if (node.cache == null || node.cache === false) {
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
