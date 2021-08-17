import { Medley } from "./Medley";
import { Node, Port, TypedPort } from "./core";
import { PortInput, RuntimeContext } from "./Context";

export class FlowEngine {
  private resultCache: Map<string, unknown>;
  constructor(private medley: Medley, cache?: Map<string, unknown>) {
    this.resultCache = cache || new Map();
  }

  public runNodeFunction = async <T>(
    context: {} | null,
    nodeId: string,
    ...args: any[]
  ): Promise<T> => {
    // use closure to capture nodeEngine on initial invocation
    const flowEngine = this;
    const getNodeFunction = async function (context: RuntimeContext) {
      const nodeFuction = await FlowEngine.buildNodeFunction(
        context,
        flowEngine,
        nodeId
      );
      return nodeFuction;
    };

    const nodeFunction = await getNodeFunction(context as RuntimeContext);
    return nodeFunction(...args);
  };

  private static async buildNodeFunction(
    context: RuntimeContext | void,
    flowEngine: FlowEngine,
    nodeId: string
  ) {
    const runNodeFunction = async function <T>(
      parentContext: RuntimeContext | undefined,
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
    const node = flowEngine.medley.getNode(nodeId);
    const portInput = flowEngine.buildPortInputFunction(
      flowEngine.medley,
      node,
      runNodeFunction
    );

    const childContext = flowEngine.createContext(
      context,
      flowEngine.medley,
      node,
      portInput
    );
    const nodeFunction = await flowEngine.medley.getNodeFunctionFromType(
      node.type
    );
    return (...args: any[]) => nodeFunction(childContext, ...args);
  }

  private createContext(
    parentContext: RuntimeContext | void,
    medley: Medley,
    node: Node,
    portInput: PortInput
  ): RuntimeContext {
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

    const childContext = {
      ...parentContext,
      medley,
      node,
      logger,
      port: {
        input: portInput,
        instances: (port: Port) => {
          return medley.getPortLinks(node.id, port.name)?.reduce((acc, l) => {
            if (l.instance) {
              acc.push(l.instance);
            }
            return acc;
          }, [] as string[]);
        },
      },
    };

    childContext.port.input = childContext.port.input.bind(childContext);
    return childContext;
  }

  private buildPortInputFunction(
    medley: Medley,
    node: Node,
    runNodeFunction: <T>(
      context: RuntimeContext,
      nodeId: string,
      ...args: any[]
    ) => Promise<T>
  ) {
    const portInputFunction = async function <T>(
      this: RuntimeContext,
      port: TypedPort<T>,
      instance?: string
    ): Promise<T | undefined> {
      let links = medley.getPortLinks(node.id, port.name);
      if (links == null || links.length === 0) {
        return;
      }
      if (instance) {
        links = links.filter((l) => l.instance === instance);
      }
      if (links.length === 0) {
        return;
      }
      const isSingle = port.singleArity == null || port.singleArity;
      if (isSingle && links.length !== 1) {
        throw new Error(`multiple links detected for port: '${port.name}'`);
      }

      if (isSingle) {
        const link = links[0];
        const result = runNodeFunction(this, link.source) as Promise<T>;
        return result;
      } else {
        const results = await Promise.all(
          links.map((l) => {
            const result = runNodeFunction(this, l.source) as Promise<
              Unboxed<T>
            >;
            return result;
          })
        );
        if (results) {
          const result = results.filter((e) => e !== undefined) as unknown;
          return result as T;
        }
      }
    };
    return portInputFunction;
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

type Unboxed<T> = T extends Array<infer U> ? U : T;
