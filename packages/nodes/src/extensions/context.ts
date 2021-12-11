import { NodeContext, Node } from "@medley-js/core";
import { isObservable, observable } from "mobx";

export const nodeStore = Symbol("nodeStore");

declare module "@medley-js/core" {
  interface NodeContext<TNode, MNode, MType, MLink> {
    getNodeStore: <T>(provider?:(context:NodeContext<TNode,MNode, MType,MLink>)=>T) => T;
    getObservableNode: () => TNode;
  }

  interface Node {
    [nodeStore]?: unknown;
  }
}

NodeContext.prototype.getNodeStore = function <T>(this: NodeContext, provider?:(context:NodeContext)=>T) {
  if(this.node[nodeStore] == null && provider){
    this.node[nodeStore] = provider(this);
  }
  return this.node[nodeStore] as T;
};

NodeContext.prototype.getObservableNode = function <TNode extends Node>(this:NodeContext<TNode>){
  if(isObservable(this.node)){
    return this.node;
  }
  const observableNode = observable.object(this.node);
  this.medley.nodes.setNode(observableNode);
  return observableNode;
}