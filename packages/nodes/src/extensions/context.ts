import { NodeContext, Node, MedleyTypes } from "@medley-js/core";
import { isObservable, observable } from "mobx";

declare module "@medley-js/core" {
  interface NodeContext<TNode extends MT["node"], MT extends MedleyTypes> {
    getNodeMetadata: <T>(key: symbol, provider?:(context:NodeContext<TNode,MT>)=>T) => T;
    getObservableNode: () => TNode;
  }

  interface Node {
    [key:symbol]: unknown;
  }
}

NodeContext.prototype.getNodeMetadata = function <T>(this: NodeContext, key: symbol, provider?:(context:NodeContext)=>T) {
  if(this.node[key] == null && provider){
    this.node[key] = provider(this);
  }
  return this.node[key] as T;
};

NodeContext.prototype.getObservableNode = function <TNode extends Node>(this:NodeContext<TNode>){
  if(isObservable(this.node)){
    return this.node;
  }
  const observableNode = observable.object(this.node);
  this.medley.nodes.setNode(observableNode);
  this.node = observableNode;
  return observableNode;
}