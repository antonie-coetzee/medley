import { Medley } from "./Medley";
import { TypedNode } from "./core";
import {
  Context,
  PortDefinition,
  PortInput,
  PortInputMultiple,
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
    return nodeFunction.bind(newContex);
  }

  private createContext(
    parentContext: Context | void,
    medley: Medley,
    node: TypedNode,
    portInputSingle: PortInput,
    portInputMultiple: PortInputMultiple
  ): Context {
    const logger = medley.getLogger().child({
      typeName: node.typeName,
      nodeId: node.id,
    });

    const instances = new Proxy(
      {},
      {
        get: (target: {}, property: string) => {
          if (typeof property === "symbol") {
            return;
          }
          return medley
            .getPortInstanceLinks(node.id, property)
            ?.map((l) => l.instance);
        },
      }
    );

    const medleyContext = Object.assign({}, medley, {
      node,
      logger,
      port: {
        single: portInputSingle,
        multiple: portInputMultiple,
        instances,
      },
    });

    const cntx: Context = {
      ...parentContext,
      medley: medleyContext,
    };

    cntx.medley.port.single = cntx.medley.port.single.bind(cntx);
    cntx.medley.port.multiple = cntx.medley.port.multiple.bind(cntx);
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
      this: Context | undefined,
      portDefinition: PortDefinition<T>,
      ...args: Parameters<T>
    ): Promise<ReturnedPromiseType<T> | undefined> {
      const links = medley.getPortLinks(node.id, portDefinition.name);
      if (links == null) {
        return;
      }
      if (links.length !== 1) {
        throw new Error(
          `multiple links detected for port: '${portDefinition.name}'`
        );
      }
      const link = links[0];
      return runNodeFunction.call(this, link.source, ...args) as Promise<
        ReturnedPromiseType<T>
      >;
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
      this: Context | undefined,
      portDefinition: PortDefinition<T>,
      ...args: Parameters<T>
    ): Promise<ReturnedPromiseType<T>[] | undefined> {
      const links = medley.getPortLinks(node.id, portDefinition.name);
      if (links == null || links.length === 0) {
        return;
      }
      const sourcePromises = links.map(
        (l) =>
          runNodeFunction.call(this, l.source, ...args) as Promise<
            ReturnedPromiseType<T>
          >
      );
      return Promise.all(sourcePromises);
    };
    return portInputMultipleFunction;
  }
}
