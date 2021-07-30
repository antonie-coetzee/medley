import { Medley } from "./Medley";
import { TypedNode } from "./core";
import {
  Context,
  PortInputFunction,
  PortInputMultipleFunction,
  ReturnedPromiseType,
} from "./Context";

export class FlowEngine {
  constructor(private medley: Medley) {}

  public runNodeFunction = async <T extends (...args: any) => any>(
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
    const nodeFunction = await getNodeFunction();
    return nodeFunction(args);
  };

  private static async buildNodeFunction(
    context: Context | void,
    flowEngine: FlowEngine,
    nodeId: string
  ) {
    const runNodeFunction = async function <P extends (...args: any) => any>(
      this: Context | undefined,
      nodeId: string,
      ...args: Parameters<P>
    ): Promise<ReturnedPromiseType<P>> {
      const nodeFuction = await FlowEngine.buildNodeFunction(
        this,
        flowEngine,
        nodeId
      );
      return nodeFuction(args);
    };

    const node = flowEngine.medley.getTypedNode(nodeId);
    const portInput = flowEngine.buildPortInputFunction(
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
      node.typeName
    );
    nodeFunction.bind(newContex);
    return nodeFunction;
  }

  private createContext(
    parentContext: Context | void,
    medley: Medley,
    node: TypedNode,
    portInput: PortInputFunction,
    portInputMultiple: PortInputMultipleFunction
  ): Context {
    const logger = medley.getLogger().child({
      typeName: node.typeName,
      nodeId: node.id,
    });

    const medleyContext = Object.assign({}, medley, {
      node,
      logger,
      portInput,
      portInputMultiple,
    });

    const cntx: Context = {
      ...parentContext,
      medley: medleyContext,
    };

    return cntx;
  }

  private buildPortInputFunction(
    medley: Medley,
    node: TypedNode,
    runNodeFunction: <T extends (...args: any) => any>(
      nodeId: string,
      ...args: Parameters<T>
    ) => Promise<ReturnedPromiseType<T>>
  ) {
    const portInputFunction = async function <T extends (...args: any) => any>(
      portName: string,
      ...args: Parameters<T>
    ): Promise<ReturnedPromiseType<T> | undefined> {
      const links = medley.getNodePortLinks(node.id, portName);
      if (links == null) {
        return;
      }
      if (links.length !== 1) {
        throw new Error(`multiple links detected for port: '${portName}'`);
      }
      const link = links[0];
      return runNodeFunction<T>(link.sourceNodeId, ...args);
    };

    return portInputFunction;
  }

  private buildPortInputMultipleFunction(
    medley: Medley,
    node: TypedNode,
    runNodeFunction: <T extends (...args: any) => any>(
      nodeId: string,
      ...args: Parameters<T>
    ) => Promise<ReturnedPromiseType<T>>
  ) {
    const portInputMultipleFunction = async function <
      T extends (...args: any) => any
    >(
      portName: string,
      ...args: Parameters<T>
    ): Promise<ReturnedPromiseType<T>[] | undefined> {
      const links = medley.getNodePortLinks(node.id, portName);
      if (links == null || links.length === 0) {
        return;
      }
      const sourcePromises = links.map((l) =>
        runNodeFunction<T>(l.sourceNodeId, ...args)
      );
      return Promise.all(sourcePromises);
    };

    return portInputMultipleFunction;
  }
}
