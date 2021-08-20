import { BasicContext } from "./Context";
import { Link, Port , Node} from "./core";

export abstract class NodeComponent<T> extends Node {
  public node?:Node;
  public init(node:Node){
    this.node = node;
  }
  public getValue(){
    return this.node?.value as T
  }

  public getPorts?: () => Port[];
  public getPortType?: (port: Port) => unknown;
  public isPortOfType?: (port: Port, type: unknown) => boolean;
  public portAddLink?: (port:  Port, link: Link) => void;
  public portRemoveLink?: (port: Port, link: Link) => void;
}