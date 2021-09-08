import { Medley } from "./Medley";
import { Link, Node, Type, TypedPort } from "./core";
import { PortInput, ExecutionContext } from "./Context";
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
    const nodeFunction = await flowEngine.medley.types.getExportFunction<
      NodeFunction<{}, TNode, TType, TLink>
    >(node.type, nodeFunctionExportName);

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

    return (...args: any[]) => nodeFunction(childContext, ...args);
  }

  private createContext(
    parentContext: ExecutionContext<TNode, TType, TLink> | void,
    medley: Medley<TNode, TType, TLink>,
    node: TNode,
    portInput: PortInput
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
      input: portInput,
    };

    childContext.input = childContext.input.bind(childContext);
    return childContext as ExecutionContext<TNode, TType, TLink>;
  }

  private buildPortInputFunction(
    medley: Medley<TNode, TType, TLink>,
    node: Node,
    runNodeFunction: <T>(
      context: ExecutionContext<TNode, TType, TLink>,
      nodeId: string,
      ...args: any[]
    ) => Promise<T>
  ) {
    const portInputFunction = async function <T>(
      this: ExecutionContext<TNode, TType, TLink>,
      port: TypedPort<T>
    ): Promise<T | undefined> {
      let links = medley.links.getPortLinks(port.name, node.id);
      if (links == null || links.length === 0) {
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
              UnArray<T>
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
    const node = this.medley.nodes.getNode(sourceId);
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

type UnArray<T> = T extends Array<infer U> ? U : T;
