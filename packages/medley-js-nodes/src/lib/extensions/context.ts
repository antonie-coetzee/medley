import { CMedleyTypes, CNode } from "@medley-js/common";
import { NodeContext, Node, MedleyTypes } from "@medley-js/core";
import { isObservable, observable } from "mobx";

declare module "@medley-js/core" {
  interface NodeContext<TNode extends MT["node"], MT extends MedleyTypes> {
    get observableNode():TNode;
  }
}

Object.defineProperty(NodeContext.prototype, "observableNode", {
  get(this: NodeContext<CNode, CMedleyTypes>){
    if(isObservable(this.node)){
      return this.node;
    }
    const node = this.medley.nodes.getNode(this.node.id) as CNode;
    if(node == null){
      this.node;
    }
    if(isObservable(node)){
      this.node = node;
      return this.node;
    }else{
      const observableNode = observable.object(node);
      this.medley.nodes.upsertNode(observableNode);
      this.node = observableNode;
      return observableNode;
    }    
  }
})