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
  constructor(private medley: Medley) {}

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

  private buildPortInputSingleFunction(
    medley: Medley,
    node: Node,
    runNodeFunction: <T extends (...args: any) => any>(
      nodeId: string,
      ...args: Parameters<T>
    ) => Promise<ReturnedPromiseType<T>>
  ) {
    const portInputSingleFunction = async function <T extends (...args: any) => any>(
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
      return runNodeFunction.call(this, link.source, ...args) as Promise<
        ReturnedPromiseType<T>
      >;
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
        links.map(
          (l) =>
            runNodeFunction.call(this, l.source, ...args) as Promise<
              ReturnedPromiseType<T>
            >
        )
      );
      if(results){
        return results.filter(e => e !== undefined);
      }
    };
    return portInputMultipleFunction;
  }
}
