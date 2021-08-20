import { Medley } from "./Medley";
import { Node, Port, TypedPort } from "./core";
import { PortInput, PortInstances, ExecutionContext } from "./Context";

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
    const getNodeFunction = async function (context: ExecutionContext) {
      const nodeFuction = await FlowEngine.buildNodeFunction(
        context,
        flowEngine,
        nodeId
      );
      return nodeFuction;
    };

    const nodeFunction = await getNodeFunction(context as ExecutionContext);
    return nodeFunction(...args);
  };

  private static async buildNodeFunction(
    context: ExecutionContext | void,
    flowEngine: FlowEngine,
    nodeId: string
  ) {
    const runNodeFunction = async function <T>(
      parentContext: ExecutionContext | undefined,
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
    const nodeFunction = await flowEngine.medley.getNodeFunctionFromType(
      node.type
    );
    // only build port interaction functions if required
    let portInput: PortInput;
    let portInstances: PortInstances;
    const nodePorts = nodeFunction.ports;
    if (nodePorts) {
      portInput = flowEngine.buildPortInputFunction(
        flowEngine.medley,
        node,
        runNodeFunction
      );
      portInstances = (port: Port) => {
        return flowEngine.medley
          .getPortLinks(node.id, port.name)
          ?.reduce((acc, l) => {
            if (l.instance) {
              acc.push(l.instance);
            }
            return acc;
          }, [] as string[]);
      };
    } else {
      portInput = async () => undefined;
      portInstances = () => undefined;
    }

    const childContext = flowEngine.createContext(
      context,
      flowEngine.medley,
      node,
      portInput,
      portInstances
    );

    return (...args: any[]) => nodeFunction(childContext, ...args);
  }

  private createContext(
    parentContext: ExecutionContext | void,
    medley: Medley,
    node: Node,
    portInput: PortInput,
    portInstances: PortInstances
  ): ExecutionContext {
    const logger = medley.getLogger().child({
      typeName: node.type,
      nodeId: node.id,
    });

    const childContext = {
      ...parentContext,
      medley,
      node,
      logger,
      port: {
        input: portInput,
        instances: portInstances,
      },
    };

    childContext.port.input = childContext.port.input.bind(childContext);
    return childContext;
  }

  private buildPortInputFunction(
    medley: Medley,
    node: Node,
    runNodeFunction: <T>(
      context: ExecutionContext,
      nodeId: string,
      ...args: any[]
    ) => Promise<T>
  ) {
    const portInputFunction = async function <T>(
      this: ExecutionContext,
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
