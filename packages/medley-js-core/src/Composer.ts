import { BaseContext, ExecutionContext, Input } from "./Context";
import { Link, NonNullableType, Port, PortLink, Unwrap } from "./core";
import { Medley } from "./Medley";
import { MedleyTypes } from "./MedleyTypes";
import {
  NodeFunction,
  nodeFunction as nodeFunctionExportName,
} from "./NodeFunction";

export type InputProvider<MT extends MedleyTypes = MedleyTypes> = {
  [index: string]: (context: BaseContext<MT>) => Promise<any>;
};

export class Composer<MT extends MedleyTypes = MedleyTypes> {
  constructor(public medley: Medley<MT>) {}

  public async runLink<T = unknown>(
    link: PortLink<NonNullableType<MT>["link"]>,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>> {
    return this.runNode(link.source, ...args);
  }

  public async runNode<T = unknown>(
    nodeId: string,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>> {
    return this.runNodeWithInputProvider(nodeId, null, ...args);
  }

  public async runNodeWithInputProvider<T = unknown>(
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
      context.input = this.inputProvider.bind({
        conductor: this,
        context,
        inputProvider,
      }) as Input;
    }

    return nodeFunction(context, args);
  }

  private async inputProvider(
    this: {
      context: ExecutionContext<MT["node"], MT>;
      conductor: Composer<MT>;
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
      conductor: Composer<MT>;
    },
    port: Port,
    ...args: any[]
  ): Promise<unknown | undefined> {
    let links = this.conductor.medley.links.getPortLinks(
      port.name,
      this.nodeId
    );
    if (links == null || links.length === 0) {
      if(port.required){
        throw new Error(`required port not linked: '${port.name}'`);
      }
      return;    
    }
    if (links.length !== 1) {
      throw new Error(`multiple links detected for port: '${port.name}'`);
    }
    const link = links[0];
    return this.conductor.runLink(link, args);
  }
}
