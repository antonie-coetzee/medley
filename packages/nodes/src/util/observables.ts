import { NodeContext, NodePart } from "@medley-js/core";
import { CNode } from "@medley-js/common";
import { observable, isObservable, toJS } from "mobx";

declare module "@medley-js/core" {
  interface NodeContext<TNode> {
    getObservableNode: () => TNode;
  }
}

NodeContext.prototype.getObservableNode = function <TNode extends CNode>(this:NodeContext<TNode>){
  if(isObservable(this.node)){
    return this.node;
  }
  const observableNode = observable.object(this.node);
  this.medley.nodes.setNode(observableNode);
  return observableNode;
}